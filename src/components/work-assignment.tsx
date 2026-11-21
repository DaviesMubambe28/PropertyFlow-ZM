"use client";

import { useActionState, useState } from "react";
import { reassignAgencyRecord } from "@/actions/assignments";
import { useAppContext } from "@/components/app-provider";

type StaffMember = { id: string; name: string };
const field = "mt-1 block w-full rounded-lg border border-line bg-canvas p-2";

export function WorkAssignment({ organizationId, staff }: { organizationId: string; staff: StaffMember[] }) {
  const { state } = useAppContext();
  const [kind, setKind] = useState("property");
  const [result, action, pending] = useActionState(reassignAgencyRecord, "");
  const propertyTitle = new Map(state.properties.map(({ id, title }) => [id, title]));
  const records = {
    property: state.properties.map(({ id, orgId, title, assignedTo }) => ({ id, orgId, title, assignedTo })),
    lead: state.leads.map(({ id, orgId, title, assignedTo }) => ({ id, orgId, title, assignedTo })),
    task: state.tasks.map(({ id, orgId, title, assigneeId }) => ({ id, orgId, title, assignedTo: assigneeId })),
    viewing: state.viewings.map(({ id, orgId, date, propertyId, agentId }) => ({ id, orgId, title: `${propertyTitle.get(propertyId) ?? "Property"} · ${date.slice(0, 10)}`, assignedTo: agentId })),
    deal: state.deals.map(({ id, orgId, clientName, assignedTo }) => ({ id, orgId, title: clientName, assignedTo })),
  };
  const options = (records[kind as keyof typeof records] ?? []).filter(({ orgId }) => orgId === organizationId);
  const staffNames = new Map(staff.map(({ id, name }) => [id, name]));

  return (
    <form action={action} className="space-y-4 rounded-lg border border-line bg-white p-5">
      <h2 className="text-xl font-semibold">Reassign work</h2>
      <p className="text-sm text-quiet">Staff must have access to a record’s branch before you can assign it to them.</p>
      <input type="hidden" name="organizationId" value={organizationId} />
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm">Record type
          <select name="kind" value={kind} onChange={(event) => setKind(event.target.value)} className={field} disabled={pending}>
            <option value="property">Property</option><option value="lead">Lead</option><option value="task">Task</option><option value="viewing">Viewing</option><option value="deal">Deal</option>
          </select>
        </label>
        <label className="text-sm">Record
          <select name="recordId" key={kind} defaultValue="" className={field} required disabled={pending || options.length === 0}>
            <option value="" disabled>{options.length ? "Choose a record" : "No records available"}</option>
            {options.map(({ id, title, assignedTo }) => <option key={id} value={id}>{title} · {assignedTo ? staffNames.get(assignedTo) ?? "Previous team member" : "Unassigned"}</option>)}
          </select>
        </label>
        <label className="text-sm">Assign to
          <select name="assignee" defaultValue="" className={field} required disabled={pending}>
            <option value="" disabled>Choose staff member</option>
            {staff.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
      </div>
      <button disabled={pending || !options.length || !staff.length} className="brand-button-primary min-h-11 rounded-lg px-4 text-sm font-semibold disabled:opacity-60">
        {pending ? "Saving…" : "Save assignment"}
      </button>
      {result && <p role="status" className="text-sm">{result}</p>}
    </form>
  );
}
