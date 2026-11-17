"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";
import { formatCurrency } from "@/lib/tenant";
import { createProperty, initialOperationState } from "@/actions/operations";

export default function PropertiesPage() {
  const { state, activeOrg } = useAppContext();
  const [result, formAction, pending] = useActionState(createProperty, initialOperationState);
  const [form, setForm] = useState({
    title: "",
    type: "Residential house",
    listingType: "sale",
    price: "780000",
    location: "Lusaka",
    bedrooms: "3",
    bathrooms: "2",
    area: "180",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
  });

  const orgProperties = state.properties.filter((property) => property.orgId === activeOrg?.id);

  return (
    <DashboardShell>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0 rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#17212F]">Property portfolio</h2>
          <div className="mt-6 space-y-4">
            {orgProperties.map((property, index) => (
              <div key={property.id} className="flex gap-4 rounded-2xl border border-[#E5EAF0] bg-[#F7F9FC] p-3">
                <Image src={property.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=70"} alt={`Photo for ${property.title}`} width={96} height={80} loading={index === 0 ? "eager" : "lazy"} unoptimized className="h-20 w-24 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate font-semibold text-[#17212F]">{property.title}</p>
                    <span className="shrink-0 rounded-full bg-[#EAF6F7] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#16803C]">{property.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#667085]">{property.location}</p>
                  <p className="mt-2 text-sm font-medium text-[#17212F]">{formatCurrency(property.price)}</p>
                </div>
              </div>
            ))}
            {orgProperties.length === 0 && <p role="status" className="rounded-xl border border-dashed border-[#D8E0E8] p-6 text-sm text-[#667085]">No properties yet. Add the first listing for this agency.</p>}
          </div>
        </div>

        <form action={formAction} className="min-w-0 rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#17212F]">Add property</h3>
          <input type="hidden" name="organizationId" value={activeOrg?.id ?? ""} />
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium">Property title<input name="title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" required /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Property type<input name="type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" required /></label>
              <label className="block text-sm font-medium">Listing type<select name="listingType" value={form.listingType} onChange={(event) => setForm({ ...form, listingType: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]">
                <option value="sale">For sale</option>
                <option value="rent">For rent</option>
              </select></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Price (ZMW)<input name="price" type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" required /></label>
              <label className="block text-sm font-medium">Location<input name="location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" required /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-medium">Bedrooms<input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={(event) => setForm({ ...form, bedrooms: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label>
              <label className="block text-sm font-medium">Bathrooms<input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={(event) => setForm({ ...form, bathrooms: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label>
              <label className="block text-sm font-medium">Area (m²)<input name="area" type="number" min="0" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label>
            </div>
            <label className="block text-sm font-medium">Description<textarea name="description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" rows={4} /></label>
            <label className="block text-sm font-medium">Image URL<input name="imageUrl" type="url" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label>
            {result.message && <p role={result.status === "error" ? "alert" : "status"} className="text-sm text-[#526174]">{result.message}</p>}
            <button type="submit" disabled={pending || !activeOrg} className="brand-button-primary w-full rounded-xl px-4 py-3 text-sm font-medium text-white disabled:opacity-60">{pending ? "Saving…" : "Save property"}</button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
