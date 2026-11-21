"use client";

import { useActionState, useEffect, useState } from "react";
import { createDeal, createTask, createViewing, updateOperationalStatus, updateViewingOutcome } from "@/actions/operations";
import { initialOperationState } from "@/lib/action-state";
import { useAppContext } from "@/components/app-provider";
import type { Viewing } from "@/lib/types";
import { formatCurrency } from "@/lib/tenant";

const input = "mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm";
function Feedback({ state }: { state: { status: string; message?: string } }) {
  return state.message ? <p role={state.status === "error" ? "alert" : "status"} className="text-sm text-quiet">{state.message}</p> : null;
}

const lusakaTime = new Intl.DateTimeFormat("en-ZM", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lusaka" });

function lusakaInputValue(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 19);
}

export function OperationsManager() {
  const [asOf, setAsOf] = useState(0);
  useEffect(() => {
    const update = () => setAsOf(Date.now());
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 30_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);
  const { state, activeOrg } = useAppContext();
  const [viewingState, viewingAction, viewingPending] = useActionState(createViewing, initialOperationState);
  const [taskState, taskAction, taskPending] = useActionState(createTask, initialOperationState);
  const [dealState, dealAction, dealPending] = useActionState(createDeal, initialOperationState);
  const orgId = activeOrg?.id ?? "";
  const leads = state.leads.filter((item) => item.orgId === orgId);
  const properties = state.properties.filter((item) => item.orgId === orgId && item.status === "available");
  const viewings = state.viewings.filter((item) => item.orgId === orgId);
  const tasks = state.tasks.filter((item) => item.orgId === orgId);
  const deals = state.deals.filter((item) => item.orgId === orgId);

  return <div className="space-y-6">
    <section id="viewings" className="grid scroll-mt-24 gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <form action={viewingAction} className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Schedule viewing</h2><input type="hidden" name="organizationId" value={orgId} />
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium">Lead<select name="leadId" className={input} required><option value="">Choose lead</option>{leads.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          <label className="block text-sm font-medium">Property<select name="propertyId" className={input} required><option value="">Choose property</option>{properties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          <label className="block text-sm font-medium">Date and time (Lusaka)<input name="scheduledAt" type="datetime-local" className={input} required /></label>
          <label className="block text-sm font-medium">Notes<textarea name="notes" className={input} rows={3} /></label>
          <Feedback state={viewingState} /><button disabled={viewingPending || !leads.length || !properties.length} className="brand-button-primary min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50">{viewingPending ? "Scheduling…" : "Schedule viewing"}</button>
        </div>
      </form>
      <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Viewings</h2>
        <div className="mt-4 space-y-3">{viewings.map((item) => <ViewingForm key={item.id} item={item} property={state.properties.find((property) => property.id === item.propertyId)?.title ?? "Property"} />)}{!viewings.length && <p className="text-sm text-quiet">No viewings scheduled.</p>}</div>
      </div>
    </section>

    <section id="tasks" className="grid scroll-mt-24 gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <form action={taskAction} className="rounded-lg border border-line bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Create task</h2><input type="hidden" name="organizationId" value={orgId} /><div className="mt-4 space-y-3">
        <label className="block text-sm font-medium">Title<input name="title" className={input} required /></label><label className="block text-sm font-medium">Due date (Lusaka)<input name="dueAt" type="datetime-local" className={input} required /></label>
        <label className="block text-sm font-medium">Priority<select name="priority" className={input}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        <label className="block text-sm font-medium">Customer <span className="font-normal text-quiet">(optional)</span><select name="contactId" className={input}><option value="">No customer</option>{state.contacts.filter((item) => item.orgId === orgId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="block text-sm font-medium">Property <span className="font-normal text-quiet">(optional)</span><select name="propertyId" className={input}><option value="">No property</option>{state.properties.filter((item) => item.orgId === orgId).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label className="block text-sm font-medium">Description<textarea name="description" className={input} rows={3} /></label>
        <Feedback state={taskState} /><button disabled={taskPending} className="brand-button-primary min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50">{taskPending ? "Saving…" : "Create task"}</button>
      </div></form>
      <div className="rounded-lg border border-line bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Tasks</h2><div className="mt-4 divide-y divide-line">{tasks.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{item.title}</p><p className="text-xs text-quiet">Due {lusakaTime.format(new Date(item.dueDate))} · {item.priority}</p>{item.status !== "done" && Date.parse(item.dueDate) < asOf && <p className="mt-1 text-xs font-semibold text-red-800">Overdue</p>}</div><RecordStatus kind="task" id={item.id} status={item.status} label={item.title} /></div>)}{!tasks.length && <p className="py-3 text-sm text-quiet">No tasks yet.</p>}</div></div>
    </section>

    <section id="deals" className="grid scroll-mt-24 gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <form action={dealAction} className="rounded-lg border border-line bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Create deal</h2><input type="hidden" name="organizationId" value={orgId} /><div className="mt-4 space-y-3">
        <label className="block text-sm font-medium">Lead<select name="leadId" className={input} required><option value="">Choose lead</option>{leads.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label className="block text-sm font-medium">Property<select name="propertyId" className={input} required><option value="">Choose property</option>{properties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label className="block text-sm font-medium">Transaction type<select name="transactionType" className={input}><option value="sale">Sale</option><option value="rental">Rental</option></select></label>
        <label className="block text-sm font-medium">Client name<input name="clientName" className={input} required /></label><label className="block text-sm font-medium">Agreed amount (ZMW)<input name="amount" type="number" min="0" className={input} required /></label>
        <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-medium">Closing date<input name="closingDate" type="date" className={input} /></label><label className="block text-sm font-medium">Lease start<input name="leaseStart" type="date" className={input} /></label></div>
        <label className="block text-sm font-medium">Monthly rent <span className="font-normal text-quiet">(rentals)</span><input name="monthlyRent" type="number" min="0" className={input} /></label><label className="block text-sm font-medium">Notes<textarea name="notes" className={input} rows={3} /></label>
        <Feedback state={dealState} /><button disabled={dealPending || !leads.length || !properties.length} className="brand-button-primary min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50">{dealPending ? "Saving…" : "Create deal"}</button>
      </div></form>
      <div className="rounded-lg border border-line bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Deals</h2><div className="mt-4 divide-y divide-line">{deals.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{item.clientName}</p><p className="text-sm text-quiet">{formatCurrency(item.amount)}</p></div><RecordStatus kind="deal" id={item.id} status={item.status} label={item.clientName} /></div>)}{!deals.length && <p className="py-3 text-sm text-quiet">No deals yet.</p>}</div></div>
    </section>
  </div>;
}


function ViewingForm({ item, property }: { item: Viewing; property: string }) {
  const [result, action, pending] = useActionState(updateViewingOutcome, initialOperationState);
  return (
    <form action={action} className="rounded-xl bg-canvas p-3">
          <input type="hidden" name="viewingId" value={item.id} />
          <p className="font-medium">{lusakaTime.format(new Date(item.date))}</p><p className="mt-1 text-sm text-quiet">{property}</p>
          <label className="mt-3 block text-xs font-medium">Scheduled time (Lusaka)
            <input name="scheduledAt" type="datetime-local" step="1" defaultValue={lusakaInputValue(item.date)} className={input} required />
          </label>
          <div className="mt-3 grid gap-2 sm:grid-cols-2"><label className="text-xs font-medium">Status<select name="status" defaultValue={item.status} className={input}><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="missed">Missed</option></select></label><label className="text-xs font-medium">Outcome<select name="outcome" defaultValue={item.outcome} className={input}><option value="">No outcome</option><option value="offer">Wants to offer</option><option value="another_viewing">Another viewing</option><option value="discontinued">Discontinued</option></select></label></div>
          <label className="mt-2 block text-xs font-medium">Feedback<textarea name="feedback" defaultValue={item.feedback} className={input} rows={2} /></label><Feedback state={result} /><button disabled={pending} className="mt-2 rounded-lg border border-line px-3 py-2 text-xs font-semibold">{pending ? "Saving…" : "Save viewing"}</button>
        </form>
  );
}


const statusOptions = {
  task: ["open", "in_progress", "done"],
  deal: ["open", "completed", "cancelled"],
};

function RecordStatus({ kind, id, status, label }: { kind: keyof typeof statusOptions; id: string; status: string; label: string }) {
  const [result, action, pending] = useActionState(updateOperationalStatus, initialOperationState);
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="recordId" value={id} />
      <input type="hidden" name="kind" value={kind} />
      <select name="status" defaultValue={status} aria-label={`Status for ${label}`} className="rounded-lg border border-line px-2 py-2 text-sm capitalize">
        {statusOptions[kind].map((option) => <option value={option} key={option}>{option.replaceAll("_", " ")}</option>)}
      </select>
      <button disabled={pending} className="rounded-lg border border-line p-2 text-xs font-semibold">{pending ? "Saving…" : "Save status"}</button>
      <Feedback state={result} />
    </form>
  );
}
