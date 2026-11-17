"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";
import { addLeadInteraction, createLead, initialOperationState, updateLeadStage } from "@/actions/operations";

const stages = ["new", "contacted", "interested", "viewing_scheduled", "negotiation", "converted", "lost"];

export default function PipelinePage() {
  const { state, activeOrg } = useAppContext();
  const [result, formAction, pending] = useActionState(createLead, initialOperationState);
  const [interactionState, interactionAction, interactionPending] = useActionState(addLeadInteraction, initialOperationState);
  const [form, setForm] = useState({ title: "", contactId: "", propertyId: "", value: "", notes: "" });

  const orgLeads = state.leads.filter((lead) => lead.orgId === activeOrg?.id);
  const orgContacts = state.contacts.filter((contact) => contact.orgId === activeOrg?.id);
  const orgProperties = state.properties.filter((property) => property.orgId === activeOrg?.id && property.status === "available");

  return (
    <DashboardShell>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form action={formAction} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Create lead</h2>
          <input type="hidden" name="organizationId" value={activeOrg?.id ?? ""} />
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Lead title
              <input name="title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="e.g. Kabulonga home enquiry" required />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Contact
              <select name="contactId" value={form.contactId} onChange={(event) => setForm({ ...form, contactId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" required>
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
              <select name="propertyId" value={form.propertyId} onChange={(event) => setForm({ ...form, propertyId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5">
                <option value="">No property selected</option>
                {orgProperties.map((property) => <option key={property.id} value={property.id}>{property.title}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Estimated value (ZMW)
              <input name="value" type="number" min="0" inputMode="numeric" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="0" required />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Notes <span className="font-normal text-slate-500">(optional)</span>
              <textarea name="notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="Follow-up context" rows={4} />
            </label>
            {result.message && <p role={result.status === "error" ? "alert" : "status"} className="text-sm text-slate-600">{result.message}</p>}
            <button type="submit" disabled={pending || orgContacts.length === 0} className="brand-button-primary w-full rounded-xl px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Saving…" : "Add lead"}</button>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Kanban pipeline</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage) => {
              const stageLeads = orgLeads.filter((lead) => lead.stage === stage);
              return (
                <div key={stage} className="rounded-2xl bg-slate-50 p-3">
                  <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{stage.replace("_", " ")}</p>
                  <div className="space-y-3">
                    {stageLeads.length > 0 ? (
                      stageLeads.map((lead) => (
                        <div key={lead.id} className="rounded-2xl bg-white p-3 shadow-sm">
                          <p className="font-medium text-slate-900">{lead.title}</p>
                          <p className="mt-1 text-sm text-slate-600">K{lead.value.toLocaleString()}</p>
                          <form action={updateLeadStage}>
                            <input type="hidden" name="leadId" value={lead.id} />
                            <select name="stage" defaultValue={lead.stage} onChange={(event) => event.currentTarget.form?.requestSubmit()} aria-label={`Stage for ${lead.title}`} className="mt-3 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm">
                              {stages.map((option) => <option key={option} value={option}>{option.replace("_", " ")}</option>)}
                            </select>
                          </form>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No leads</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <form action={interactionAction} className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Record customer interaction</h3>
            <input type="hidden" name="organizationId" value={activeOrg?.id ?? ""} />
            <div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Lead<select name="leadId" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" required><option value="">Choose lead</option>{orgLeads.map((lead) => <option key={lead.id} value={lead.id}>{lead.title}</option>)}</select></label><label className="text-sm font-medium">Interaction type<select name="interactionType" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5"><option value="note">Note</option><option value="call">Call</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="meeting">Meeting</option></select></label></div>
            <label className="mt-3 block text-sm font-medium">Summary<textarea name="summary" rows={3} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" required /></label>
            {interactionState.message && <p role={interactionState.status === "error" ? "alert" : "status"} className="mt-2 text-sm text-slate-600">{interactionState.message}</p>}
            <button disabled={interactionPending || !orgLeads.length} className="brand-button-primary mt-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{interactionPending ? "Saving…" : "Record interaction"}</button>
            {state.leadInteractions.filter((item) => item.orgId === activeOrg?.id).slice(0, 5).map((item) => <p key={item.id} className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-600"><span className="font-semibold uppercase">{item.interactionType}</span> · {item.summary}</p>)}
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
