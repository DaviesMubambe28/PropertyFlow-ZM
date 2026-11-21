"use client";

import { useActionState, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";
import { createContact } from "@/actions/operations";
import { initialOperationState } from "@/lib/action-state";

export default function ContactsPage() {
  const { state, activeOrg } = useAppContext();
  const [result, formAction, pending] = useActionState(createContact, initialOperationState);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    category: "buyer",
    leadSource: "Website",
    budget: "K500,000",
    notes: "",
    preferredLocation: "",
    preferences: "",
  });

  const orgContacts = state.contacts.filter((contact) => contact.orgId === activeOrg?.id);

  return (
    <DashboardShell>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-ink">Contacts</h2>
          <div className="mt-6 space-y-4">
            {orgContacts.map((contact) => (
              <div key={contact.id} className="rounded-2xl border border-line bg-canvas p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">{contact.name}</p>
                  <span className="rounded-full bg-sage px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-pine">{contact.category}</span>
                </div>
                <p className="mt-2 text-sm text-muted-ink">{contact.email} • {contact.phone}</p>
                <p className="mt-2 text-sm text-muted-ink">Budget: {contact.budget}</p>
              </div>
            ))}
            {orgContacts.length === 0 && <p role="status" className="rounded-xl border border-dashed border-line p-6 text-sm text-muted-ink">No contacts yet. Add the first buyer, seller, landlord, or tenant.</p>}
          </div>
        </div>

        <form action={formAction} className="rounded-[28px] border border-line bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-ink">Create contact</h3>
          <input type="hidden" name="organizationId" value={activeOrg?.id ?? ""} />
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium">Full name<input name="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" required /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Email<input name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" required /></label>
              <label className="block text-sm font-medium">Phone<input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" required /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Category<select name="category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink"><option value="buyer">Buyer</option><option value="seller">Seller</option><option value="landlord">Landlord</option><option value="tenant">Tenant</option></select></label>
              <label className="block text-sm font-medium">Lead source<input name="leadSource" value={form.leadSource} onChange={(event) => setForm({ ...form, leadSource: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label>
            </div>
            <label className="block text-sm font-medium">Budget<input name="budget" value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">WhatsApp<input name="whatsapp" type="tel" value={form.whatsapp} onChange={(event) => setForm({ ...form, whatsapp: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label><label className="block text-sm font-medium">Preferred location<input name="preferredLocation" value={form.preferredLocation} onChange={(event) => setForm({ ...form, preferredLocation: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label></div>
            <label className="block text-sm font-medium">Property preferences<textarea name="preferences" value={form.preferences} onChange={(event) => setForm({ ...form, preferences: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" rows={3} /></label>
            <label className="block text-sm font-medium">Notes<textarea name="notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" rows={4} /></label>
            {result.message && <p role={result.status === "error" ? "alert" : "status"} className="text-sm text-muted-ink">{result.message}</p>}
            <button type="submit" disabled={pending || !activeOrg} className="brand-button-primary w-full rounded-xl px-4 py-3 text-sm font-medium text-white disabled:opacity-60">{pending ? "Saving…" : "Add contact"}</button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
