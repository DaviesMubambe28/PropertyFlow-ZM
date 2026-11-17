"use client";

import { useActionState } from "react";
import { createDeal, createTask, createViewing, initialOperationState, updateOperationalStatus } from "@/actions/operations";
import { useAppContext } from "@/components/app-provider";
import { formatCurrency } from "@/lib/tenant";

const input = "mt-1.5 w-full rounded-xl border border-[#D8E0E8] bg-[#F9FBFC] px-3 py-2.5 text-sm";
function Feedback({ state }: { state: { status: string; message?: string } }) {
  return state.message ? <p role={state.status === "error" ? "alert" : "status"} className="text-sm text-[#526174]">{state.message}</p> : null;
}

export function OperationsManager() {
  const { state, activeOrg } = useAppContext();
  const [viewingState, viewingAction, viewingPending] = useActionState(createViewing, initialOperationState);
  const [taskState, taskAction, taskPending] = useActionState(createTask, initialOperationState);
  const [dealState, dealAction, dealPending] = useActionState(createDeal, initialOperationState);
  const orgId = activeOrg?.id ?? "";
  const leads = state.leads.filter((item) => item.orgId === orgId);
  const properties = state.properties.filter((item) => item.orgId === orgId && item.status === "active");
  const viewings = state.viewings.filter((item) => item.orgId === orgId);
  const tasks = state.tasks.filter((item) => item.orgId === orgId);
  const deals = state.deals.filter((item) => item.orgId === orgId);

  return <div className="space-y-6">
    <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <form action={viewingAction} className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Schedule viewing</h2><input type="hidden" name="organizationId" value={orgId} />
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium">Lead<select name="leadId" className={input} required><option value="">Choose lead</option>{leads.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          <label className="block text-sm font-medium">Property<select name="propertyId" className={input} required><option value="">Choose property</option>{properties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          <label className="block text-sm font-medium">Date and time<input name="scheduledAt" type="datetime-local" className={input} required /></label>
          <label className="block text-sm font-medium">Notes<textarea name="notes" className={input} rows={3} /></label>
          <Feedback state={viewingState} /><button disabled={viewingPending || !leads.length || !properties.length} className="brand-button-primary min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50">{viewingPending ? "Scheduling…" : "Schedule viewing"}</button>
        </div>
      </form>
      <div className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Upcoming viewings</h2><div className="mt-4 space-y-3">{viewings.map((item) => <div key={item.id} className="rounded-xl bg-[#F7F9FC] p-3"><p className="font-medium">{new Date(item.date).toLocaleString("en-ZM")}</p><p className="mt-1 text-sm text-[#667085]">{properties.find((property) => property.id === item.propertyId)?.title ?? "Property"} · {item.status}</p></div>)}{!viewings.length && <p className="text-sm text-[#667085]">No viewings scheduled.</p>}</div></div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <form action={taskAction} className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Create task</h2><input type="hidden" name="organizationId" value={orgId} /><div className="mt-4 space-y-3">
        <label className="block text-sm font-medium">Title<input name="title" className={input} required /></label><label className="block text-sm font-medium">Due date<input name="dueAt" type="datetime-local" className={input} required /></label>
        <label className="block text-sm font-medium">Priority<select name="priority" className={input}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="block text-sm font-medium">Description<textarea name="description" className={input} rows={3} /></label>
        <Feedback state={taskState} /><button disabled={taskPending} className="brand-button-primary min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50">{taskPending ? "Saving…" : "Create task"}</button>
      </div></form>
      <div className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Tasks</h2><div className="mt-4 divide-y divide-[#E5EAF0]">{tasks.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{item.title}</p><p className="text-xs text-[#667085]">Due {new Date(item.dueDate).toLocaleString("en-ZM")} · {item.priority}</p></div><form action={updateOperationalStatus}><input type="hidden" name="recordId" value={item.id} /><input type="hidden" name="kind" value="task" /><select name="status" defaultValue={item.status} onChange={(event) => event.currentTarget.form?.requestSubmit()} aria-label={`Status for ${item.title}`} className="rounded-lg border border-[#D8E0E8] px-2 py-1.5 text-sm"><option value="open">Open</option><option value="in_progress">In progress</option><option value="done">Done</option></select></form></div>)}{!tasks.length && <p className="py-3 text-sm text-[#667085]">No tasks yet.</p>}</div></div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <form action={dealAction} className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Create deal</h2><input type="hidden" name="organizationId" value={orgId} /><div className="mt-4 space-y-3">
        <label className="block text-sm font-medium">Lead<select name="leadId" className={input} required><option value="">Choose lead</option>{leads.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label className="block text-sm font-medium">Property<select name="propertyId" className={input} required><option value="">Choose property</option>{properties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label className="block text-sm font-medium">Client name<input name="clientName" className={input} required /></label><label className="block text-sm font-medium">Amount (ZMW)<input name="amount" type="number" min="0" className={input} required /></label><label className="block text-sm font-medium">Notes<textarea name="notes" className={input} rows={3} /></label>
        <Feedback state={dealState} /><button disabled={dealPending || !leads.length || !properties.length} className="brand-button-primary min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50">{dealPending ? "Saving…" : "Create deal"}</button>
      </div></form>
      <div className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Deals</h2><div className="mt-4 divide-y divide-[#E5EAF0]">{deals.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{item.clientName}</p><p className="text-sm text-[#667085]">{formatCurrency(item.amount)}</p></div><form action={updateOperationalStatus}><input type="hidden" name="recordId" value={item.id} /><input type="hidden" name="kind" value="deal" /><select name="status" defaultValue={item.status} onChange={(event) => event.currentTarget.form?.requestSubmit()} aria-label={`Status for ${item.clientName}`} className="rounded-lg border border-[#D8E0E8] px-2 py-1.5 text-sm"><option value="open">Open</option><option value="closed">Closed</option></select></form></div>)}{!deals.length && <p className="py-3 text-sm text-[#667085]">No deals yet.</p>}</div></div>
    </section>
  </div>;
}
