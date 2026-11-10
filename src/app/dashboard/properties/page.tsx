"use client";

import Image from "next/image";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";
import { formatCurrency } from "@/lib/tenant";

export default function PropertiesPage() {
  const { state, activeOrg, createProperty } = useAppContext();
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

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createProperty({
      title: form.title,
      type: form.type,
      listingType: form.listingType as "sale" | "rent",
      price: Number(form.price),
      location: form.location,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      description: form.description,
      imageUrl: form.imageUrl,
      status: "active",
      featured: false,
    });

    setForm({
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
  }

  return (
    <DashboardShell>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0 rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#17212F]">Property portfolio</h2>
          <div className="mt-6 space-y-4">
            {orgProperties.map((property, index) => (
              <div key={property.id} className="flex gap-4 rounded-2xl border border-[#E5EAF0] bg-[#F7F9FC] p-3">
                <Image src={property.imageUrl} alt={`Example photo for ${property.title}`} width={96} height={80} loading={index === 0 ? "eager" : "lazy"} unoptimized className="h-20 w-24 rounded-xl object-cover" />
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
          </div>
        </div>

        <form onSubmit={handleCreate} className="min-w-0 rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#17212F]">Add property</h3>
          <div className="mt-6 space-y-4">
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Property title" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Property type" required />
              <select value={form.listingType} onChange={(event) => setForm({ ...form, listingType: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]">
                <option value="sale">For sale</option>
                <option value="rent">For rent</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Price" required />
              <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Location" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <input value={form.bedrooms} onChange={(event) => setForm({ ...form, bedrooms: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Bedrooms" />
              <input value={form.bathrooms} onChange={(event) => setForm({ ...form, bathrooms: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Bathrooms" />
              <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Area" />
            </div>
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Description" rows={4} required />
            <input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" placeholder="Image URL" />
            <button type="submit" className="brand-button-primary w-full rounded-xl px-4 py-3 text-sm font-medium text-white">Save property</button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
