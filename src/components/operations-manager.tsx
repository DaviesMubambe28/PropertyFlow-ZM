"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createDeal, createTask, createViewing, updateOperationalStatus, updateViewingOutcome } from "@/actions/operations";
import { initialOperationState } from "@/lib/action-state";
import { useAppContext } from "@/components/app-provider";
import { formatCurrency } from "@/lib/tenant";

const input = "mt-1.5 w-full rounded-xl border border-[#D8E0E8] bg-[#F9FBFC] px-3 py-2.5 text-sm";
function Feedback({ state }: { state: { status: string; message?: string } }) {
  return state.message ? <p role={state.status === "error" ? "alert" : "status"} className="text-sm text-[#526174]">{state.message}</p> : null;
}

export function OperationsManager() {
  const { state, activeOrg } = useAppContext();
  const openOnly = useSearchParams().get("status") === "open";
  const [viewingState, viewingAction, viewingPending] = useActionState(createViewing, initialOperationState);
  const [taskState, taskAction, taskPending] = useActionState(createTask, initialOperationState);
  const [dealState, dealAction, dealPending] = useActionState(createDeal, initialOperationState);
  const orgId = activeOrg?.id ?? "";
  const leads = state.leads.filter((item) => item.orgId === orgId);
  const properties = state.properties.filter((item) => item.orgId === orgId && item.status === "available");
  const viewings = state.viewings.filter((item) => item.orgId === orgId);
  const tasks = state.tasks.filter((item) => item.orgId === orgId && (!openOnly || item.status !== "done"));
  const deals = state.deals.filter((item) => item.orgId === orgId && (!openOnly || item.status === "open"));

  return <div className="space-y-6">
    {openOnly && <Link href="/dashboard/activities" className="inline-block text-sm font-semibold text-teal-800 underline">Show all tasks and deals</Link>}
    <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <form id="viewing-form" action={viewingAction} className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Schedule viewing</h2><input type="hidden" name="organizationId" value={orgId} />
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium">Lead<select name="leadId" className={input} required><option value="">Choose lead</option>{leads.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          <label className="block text-sm font-medium">Property<select name="propertyId" className={input} required><option value="">Choose property</option>{properties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          <label className="block text-sm font-medium">Date and time (Lusaka)<input name="scheduledAt" type="datetime-local" className={input} required /></label>
          <label className="block text-sm font-medium">Notes<textarea name="notes" className={input} rows={3} /></label>
          <Feedback state={viewingState} /><button disabled={viewingPending || !leads.length || !properties.length} className="brand-button-primary min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50">{viewingPending ? "Scheduling…" : "Schedule viewing"}</button>
        </div>
      </form>
      <div className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Viewings</h2>
        <div className="mt-4 space-y-3">{viewings.map((item) => <form action={updateViewingOutcome} key={item.id} className="rounded-xl bg-[#F7F9FC] p-3">
          <input type="hidden" name="viewingId" value={item.id} />
          <p className="font-medium">{new Date(item.date).toLocaleString("en-ZM", { timeZone: "Africa/Lusaka" })}</p><p className="mt-1 text-sm text-[#667085]">{state.properties.find((property) => property.id === item.propertyId)?.title ?? "Property"}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2"><label className="text-xs font-medium">Status<select name="status" defaultValue={item.status} className={input}><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="missed">Missed</option></select></label><label className="text-xs font-medium">Outcome<select name="outcome" defaultValue={item.outcome} className={input}><option value="">No outcome</option><option value="offer">Wants to offer</option><option value="another_viewing">Another viewing</option><option value="discontinued">Discontinued</option></select></label></div>
          <label className="mt-2 block text-xs font-medium">Feedback<textarea name="feedback" defaultValue={item.feedback} className={input} rows={2} /></label><button className="mt-2 rounded-lg border border-[#D8E0E8] px-3 py-2 text-xs font-semibold">Save outcome</button>
        </form>)}{!viewings.length && <p className="text-sm text-[#667085]">No viewings scheduled.</p>}</div>
      </div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <form action={taskAction} className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Create task</h2><input type="hidden" name="organizationId" value={orgId} /><div className="mt-4 space-y-3">
        <label className="block text-sm font-medium">Title<input name="title" className={input} required /></label><label className="block text-sm font-medium">Due date (Lusaka)<input name="dueAt" type="datetime-local" className={input} required /></label>
        <label className="block text-sm font-medium">Priority<select name="priority" className={input}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        <label className="block text-sm font-medium">Customer <span className="font-normal text-[#667085]">(optional)</span><select name="contactId" className={input}><option value="">No customer</option>{state.contacts.filter((item) => item.orgId === orgId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="block text-sm font-medium">Property <span className="font-normal text-[#667085]">(optional)</span><select name="propertyId" className={input}><option value="">No property</option>{state.properties.filter((item) => item.orgId === orgId).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label className="block text-sm font-medium">Description<textarea name="description" className={input} rows={3} /></label>
        <Feedback state={taskState} /><button disabled={taskPending} className="brand-button-primary min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50">{taskPending ? "Saving…" : "Create task"}</button>
      </div></form>
      <div className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold" id="follow-ups">Tasks</h2><div className="mt-4 divide-y divide-[#E5EAF0]">{tasks.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{item.title}</p><p className="text-xs text-[#667085]">Due {new Date(item.dueDate).toLocaleString("en-ZM", { timeZone: "Africa/Lusaka" })} · {item.priority}</p></div><form action={updateOperationalStatus}><input type="hidden" name="recordId" value={item.id} /><input type="hidden" name="kind" value="task" /><select name="status" defaultValue={item.status} onChange={(event) => event.currentTarget.form?.requestSubmit()} aria-label={`Status for ${item.title}`} className="rounded-lg border border-[#D8E0E8] px-2 py-1.5 text-sm"><option value="open">Open</option><option value="in_progress">In progress</option><option value="done">Done</option></select></form></div>)}{!tasks.length && <p className="py-3 text-sm text-[#667085]">No tasks yet.</p>}</div></div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <form action={dealAction} className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Create deal</h2><input type="hidden" name="organizationId" value={orgId} /><div className="mt-4 space-y-3">
        <label className="block text-sm font-medium">Lead<select name="leadId" className={input} required><option value="">Choose lead</option>{leads.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label className="block text-sm font-medium">Property<select name="propertyId" className={input} required><option value="">Choose property</option>{properties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label className="block text-sm font-medium">Transaction type<select name="transactionType" className={input}><option value="sale">Sale</option><option value="rental">Rental</option></select></label>
        <label className="block text-sm font-medium">Client name<input name="clientName" className={input} required /></label><label className="block text-sm font-medium">Agreed amount (ZMW)<input name="amount" type="number" min="0" className={input} required /></label>
        <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-medium">Closing date<input name="closingDate" type="date" className={input} /></label><label className="block text-sm font-medium">Lease start<input name="leaseStart" type="date" className={input} /></label></div>
        <label className="block text-sm font-medium">Monthly rent <span className="font-normal text-[#667085]">(rentals)</span><input name="monthlyRent" type="number" min="0" className={input} /></label><label className="block text-sm font-medium">Notes<textarea name="notes" className={input} rows={3} /></label>
        <Feedback state={dealState} /><button disabled={dealPending || !leads.length || !properties.length} className="brand-button-primary min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50">{dealPending ? "Saving…" : "Create deal"}</button>
      </div></form>
      <div className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold" id="deals">Deals</h2><div className="mt-4 divide-y divide-[#E5EAF0]">{deals.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{item.clientName}</p><p className="text-sm text-[#667085]">{formatCurrency(item.amount)}</p></div><form action={updateOperationalStatus}><input type="hidden" name="recordId" value={item.id} /><input type="hidden" name="kind" value="deal" /><select name="status" defaultValue={item.status} onChange={(event) => event.currentTarget.form?.requestSubmit()} aria-label={`Status for ${item.clientName}`} className="rounded-lg border border-[#D8E0E8] px-2 py-1.5 text-sm"><option value="open">Open</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></form></div>)}{!deals.length && <p className="py-3 text-sm text-[#667085]">No deals yet.</p>}</div></div>
    </section>
  </div>;
}
