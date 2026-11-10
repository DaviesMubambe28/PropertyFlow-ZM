"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";

export default function ContactsPage() {
  const { state, activeOrg, createContact } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "buyer",
    leadSource: "Website",
    budget: "K500,000",
    notes: "",
  });

  const orgContacts = state.contacts.filter((contact) => contact.orgId === activeOrg?.id);

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createContact({
      name: form.name,
      email: form.email,
      phone: form.phone,
      category: form.category,
      leadSource: form.leadSource,
      budget: form.budget,
      notes: form.notes,
    });
    setForm({
      name: "",
      email: "",
      phone: "",
      category: "buyer",
      leadSource: "Website",
      budget: "K500,000",
      notes: "",
    });
  }

  return (
    <DashboardShell>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#17212F]">Contacts</h2>
          <div className="mt-6 space-y-4">
            {orgContacts.map((contact) => (
              <div key={contact.id} className="rounded-2xl border border-[#E5EAF0] bg-[#F7F9FC] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#17212F]">{contact.name}</p>
                  <span className="rounded-full bg-[#EAF6F7] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#087F8C]">{contact.category}</span>
                </div>
                <p className="mt-2 text-sm text-[#667085]">{contact.email} • {contact.phone}</p>
                <p className="mt-2 text-sm text-[#667085]">Budget: {contact.budget}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleCreate} className="rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#17212F]">Create contact</h3>
          <div className="mt-6 space-y-4">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Full name" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Email" required />
              <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Phone" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Category" required />
              <input value={form.leadSource} onChange={(event) => setForm({ ...form, leadSource: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Lead source" required />
            </div>
            <input value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Budget" required />
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Client notes" rows={4} />
            <button type="submit" className="brand-button-primary w-full rounded-xl px-4 py-3 text-sm font-medium text-white">Add contact</button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
