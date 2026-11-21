"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";
import { addLeadInteraction, createLead, updateLeadStage } from "@/actions/operations";
import { initialOperationState } from "@/lib/action-state";

const stages = ["new", "contacted", "interested", "viewing_scheduled", "negotiation", "converted", "lost"];

export default function PipelinePage() {
  const { state, activeOrg } = useAppContext();
  const [view, setView] = useState("board");
  const [query, setQuery] = useState("");
  const [result, formAction, pending] = useActionState(createLead, initialOperationState);
  const [interactionState, interactionAction, interactionPending] = useActionState(addLeadInteraction, initialOperationState);
  const [form, setForm] = useState({ title: "", contactId: "", propertyId: "", value: "", notes: "" });

  const orgLeads = state.leads.filter((lead) => lead.orgId === activeOrg?.id);
  const orgContacts = state.contacts.filter((contact) => contact.orgId === activeOrg?.id);
  const orgProperties = state.properties.filter((property) => property.orgId === activeOrg?.id && property.status === "available");

  const visibleLeads = orgLeads.filter((lead) => lead.title.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <DashboardShell>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form action={formAction} className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-deep">Create lead</h2>
          <input type="hidden" name="organizationId" value={activeOrg?.id ?? ""} />
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Lead title
              <input name="title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5" placeholder="e.g. Kabulonga home enquiry" required />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Contact
              <select name="contactId" value={form.contactId} onChange={(event) => setForm({ ...form, contactId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5" required>
                <option value="">Select a contact</option>
                {orgContacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.name}</option>)}
              </select>
            </label>
            {orgContacts.length === 0 && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Add a contact before creating a lead. <Link href="/dashboard/contacts" className="font-semibold underline underline-offset-2">Create a contact</Link>
              </p>
            )}
            <label className="block text-sm font-medium text-slate-700">
              Related property <span className="font-normal text-slate-500">(optional)</span>
              <select name="propertyId" value={form.propertyId} onChange={(event) => setForm({ ...form, propertyId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5">
                <option value="">No property selected</option>
                {orgProperties.map((property) => <option key={property.id} value={property.id}>{property.title}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Estimated value (ZMW)
              <input name="value" type="number" min="0" inputMode="numeric" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5" placeholder="0" required />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Notes <span className="font-normal text-slate-500">(optional)</span>
              <textarea name="notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5" placeholder="Follow-up context" rows={4} />
            </label>
            {result.message && <p role={result.status === "error" ? "alert" : "status"} className="text-sm text-quiet">{result.message}</p>}
            <button type="submit" disabled={pending || orgContacts.length === 0} className="brand-button-primary w-full rounded-xl px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Saving…" : "Add lead"}</button>
          </div>
        </form>

        <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-deep">Lead pipeline</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <label className="grid gap-1 text-sm">Find a lead
              <input type="search" className="rounded-lg border border-line p-2" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">View as
              <select className="rounded-lg border border-line p-2" value={view} onChange={(event) => setView(event.target.value)}>
                <option value="board">Board</option><option value="table">Table</option>
              </select>
            </label>
          </div>
          {view === "table" && (
            <div className="mt-4 overflow-auto">
              <table className="w-full min-w-[24rem] text-left text-sm">
                <thead><tr className="border-b border-line"><th scope="col" className="p-2">Lead</th><th scope="col" className="p-2">Value (ZMW)</th><th scope="col" className="p-2">Stage</th></tr></thead>
                <tbody>{visibleLeads.map((lead) => (
                  <tr className="scroll-mt-48 border-b border-line" key={lead.id} id={`lead-${lead.id}`}>
                    <th scope="row" className="p-2">{lead.title}</th>
                    <td className="p-2">{lead.value.toLocaleString("en-ZM")}</td>
                    <td className="p-2"><LeadStage leadId={lead.id} stage={lead.stage} label={lead.title} stages={stages} /></td>
                  </tr>
                ))}</tbody>
              </table>
              {visibleLeads.length === 0 && <p className="p-2 text-sm text-quiet">No matching leads.</p>}
            </div>
          )}
          {view === "board" && <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage) => {
              const stageLeads = visibleLeads.filter((lead) => lead.stage === stage);
              return (
                <div key={stage} className="rounded-lg bg-canvas p-3">
                  <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{stage.replace("_", " ")}</p>
                  <div className="space-y-3">
                    {stageLeads.length > 0 ? (
                      stageLeads.map((lead) => (
                        <div key={lead.id} id={`lead-${lead.id}`} className="scroll-mt-48 rounded-lg bg-white p-3 shadow-sm">
                          <p className="font-medium text-deep">{lead.title}</p>
                          <p className="mt-1 text-sm text-quiet">K{lead.value.toLocaleString()}</p>
                          <LeadStage leadId={lead.id} stage={lead.stage} label={lead.title} stages={stages} />
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed border-line p-4 text-sm text-slate-500">No leads</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>}
          <form action={interactionAction} className="mt-6 rounded-lg border border-line bg-canvas p-4">
            <h3 className="font-semibold text-deep">Record customer interaction</h3>
            <input type="hidden" name="organizationId" value={activeOrg?.id ?? ""} />
            <div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Lead<select name="leadId" className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5" required><option value="">Choose lead</option>{orgLeads.map((lead) => <option key={lead.id} value={lead.id}>{lead.title}</option>)}</select></label><label className="text-sm font-medium">Interaction type<select name="interactionType" className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5"><option value="note">Note</option><option value="call">Call</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="meeting">Meeting</option></select></label></div>
            <label className="mt-3 block text-sm font-medium">Summary<textarea name="summary" rows={3} className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5" required /></label>
            {interactionState.message && <p role={interactionState.status === "error" ? "alert" : "status"} className="mt-2 text-sm text-quiet">{interactionState.message}</p>}
            <button disabled={interactionPending || !orgLeads.length} className="brand-button-primary mt-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{interactionPending ? "Saving…" : "Record interaction"}</button>
            {state.leadInteractions.filter((item) => item.orgId === activeOrg?.id).slice(0, 5).map((item) => <p key={item.id} className="mt-3 border-t border-line pt-3 text-xs text-quiet"><span className="font-semibold uppercase">{item.interactionType}</span> · {item.summary}</p>)}
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}


function LeadStage({ leadId, stage, label, stages }: { leadId: string; stage: string; label: string; stages: readonly string[] }) {
  const [result, action, pending] = useActionState(updateLeadStage, initialOperationState);
  return (
    <form action={action} className="mt-3 space-y-2">
      <input type="hidden" name="leadId" value={leadId} />
      <select name="stage" defaultValue={stage} aria-label={`Stage for ${label}`} className="w-full rounded-lg border border-line px-2 py-2 text-sm capitalize">
        {stages.map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}
      </select>
      <button disabled={pending} className="rounded-lg border border-line p-2 text-xs font-semibold">{pending ? "Saving…" : "Save stage"}</button>
      {result.message && <p role={result.status === "error" ? "alert" : "status"} className="text-xs text-quiet">{result.message}</p>}
    </form>
  );
}
