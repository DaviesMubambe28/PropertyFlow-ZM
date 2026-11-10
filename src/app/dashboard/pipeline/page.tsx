"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";

const stages = ["new", "contacted", "qualified", "viewing_scheduled", "negotiation", "won", "lost"];

export default function PipelinePage() {
  const { state, activeOrg, currentUser, createLead, updateLeadStage } = useAppContext();
  const [form, setForm] = useState({ title: "", contactId: "", propertyId: "", value: "", notes: "" });

  const orgLeads = state.leads.filter((lead) => lead.orgId === activeOrg?.id);
  const orgContacts = state.contacts.filter((contact) => contact.orgId === activeOrg?.id);
  const orgProperties = state.properties.filter((property) => property.orgId === activeOrg?.id && property.status === "active");

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser || !form.contactId) return;

    const lead = createLead({
      contactId: form.contactId,
      propertyId: form.propertyId || undefined,
      title: form.title,
      stage: "new",
      assignedTo: currentUser.id,
      value: Number(form.value),
      notes: form.notes,
    });
    if (lead) setForm({ title: "", contactId: "", propertyId: "", value: "", notes: "" });
  }

  return (
    <DashboardShell>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleCreate} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Create lead</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Lead title
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="e.g. Kabulonga home enquiry" required />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Contact
              <select value={form.contactId} onChange={(event) => setForm({ ...form, contactId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" required>
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
              <select value={form.propertyId} onChange={(event) => setForm({ ...form, propertyId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5">
                <option value="">No property selected</option>
                {orgProperties.map((property) => <option key={property.id} value={property.id}>{property.title}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Estimated value (ZMW)
              <input type="number" min="0" inputMode="numeric" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="0" required />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Notes <span className="font-normal text-slate-500">(optional)</span>
              <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="Follow-up context" rows={4} />
            </label>
            <button type="submit" disabled={orgContacts.length === 0} className="brand-button-primary w-full rounded-xl px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">Add lead</button>
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
                          <select
                            value={lead.stage}
                            onChange={(event) => updateLeadStage(lead.id, event.target.value as typeof lead.stage)}
                            className="mt-3 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                          >
                            {stages.map((option) => (
                              <option key={option} value={option}>{option.replace("_", " ")}</option>
                            ))}
                          </select>
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
        </div>
      </div>
    </DashboardShell>
  );
}
