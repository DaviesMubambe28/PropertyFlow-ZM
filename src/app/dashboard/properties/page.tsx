"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";
import type { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/tenant";
import { createProperty } from "@/actions/operations";
import { initialOperationState } from "@/lib/action-state";

export default function PropertiesPage() {
  return <DashboardShell><Suspense fallback={<p role="status">Loading portfolio…</p>}><PropertyPortfolio /></Suspense></DashboardShell>;
}

function PropertyPortfolio() {
  const { state, activeOrg } = useAppContext();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [search, setSearch] = useState("");
  const editId = searchParams.get("edit");
  const editing = state.properties.find((property) => property.id === editId && property.orgId === activeOrg?.id);

  const orgProperties = state.properties.filter((property) => property.orgId === activeOrg?.id &&
    (status !== "available" || property.status === "available") &&
    `${property.title} ${property.location} ${property.type}`.toLowerCase().includes(search.trim().toLowerCase()));

  return (
      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0 rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#17212F]">{status === "available" ? "Available properties" : "Property portfolio"}</h2>
          {status === "available" && <Link href="/dashboard/properties" className="mt-2 inline-block text-sm font-semibold text-teal-800 underline">Show all statuses</Link>}
          <label className="mt-4 block text-sm font-medium">Search portfolio<input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Title, type or location" className="mt-1 block w-full rounded-lg border border-slate-300 p-2" /></label>
          <div className="mt-6 space-y-4">
            {orgProperties.map((property, index) => (
              <div key={property.id} className="flex gap-4 rounded-2xl border border-[#E5EAF0] bg-[#F7F9FC] p-3">
                {property.imageUrl ? <Image src={property.imageUrl} alt={`Photo for ${property.title}`} width={96} height={80} loading={index === 0 ? "eager" : "lazy"} unoptimized className="h-20 w-24 rounded-xl object-cover" /> : <div className="grid h-20 w-24 shrink-0 place-items-center rounded-xl bg-slate-200 text-center text-xs text-slate-700">No photo</div>}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate font-semibold text-[#17212F]">{property.title}</p>
                    <span className="shrink-0 rounded-full bg-[#EAF6F7] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#16803C]">{property.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#667085]">{property.location}</p>
                  <p className="mt-2 text-sm font-medium text-[#17212F]">{formatCurrency(property.price)}</p>
                  <Link href={`?edit=${property.id}${status === "available" ? "&status=available" : ""}#property-form`} className="mt-2 inline-block text-sm font-semibold text-teal-800 underline">Edit<span className="sr-only"> {property.title}</span></Link>
                </div>
              </div>
            ))}
            {orgProperties.length === 0 && <p role="status" className="rounded-xl border border-dashed border-[#D8E0E8] p-6 text-sm text-[#667085]">No properties match the current filters.</p>}
          </div>
        </div>

        <PropertyForm key={editing?.id ?? activeOrg?.id} organizationId={activeOrg?.id ?? ""} property={editing} />
      </div>
  );
}


function PropertyForm({ property, organizationId }: { property?: Property; organizationId: string }) {
  const [result, formAction, pending] = useActionState(createProperty, initialOperationState);
  const [form, setForm] = useState({
    title: property?.title ?? "",
    type: property?.type ?? "",
    listingType: property?.listingType ?? "sale",
    price: property ? String(property.price) : "",
    location: property?.location ?? "",
    province: property?.province ?? "",
    bedrooms: property ? String(property.bedrooms) : "",
    bathrooms: property ? String(property.bathrooms) : "",
    area: property ? String(property.area) : "",
    description: property?.description ?? "",
    imageUrl: property?.imageUrl ?? "",
    status: property?.status ?? "available",
    ownerName: property?.ownerName ?? "",
    ownerPhone: property?.ownerPhone ?? "",
  });
  return (
        <form id="property-form" action={formAction} className="min-w-0 rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#17212F]">{property ? "Edit property" : "Add property"}</h3>
          {property && <Link href="/dashboard/properties#property-form" className="mt-2 inline-block text-sm font-semibold text-teal-800 underline">Add a new property</Link>}
          {property && <input type="hidden" name="propertyId" value={property.id} />}
          <input type="hidden" name="organizationId" value={organizationId} />
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium">Property title<input name="title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" required /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Property type<input name="type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" required /></label>
              <label className="block text-sm font-medium">Listing type<select name="listingType" value={form.listingType} onChange={(event) => setForm({ ...form, listingType: event.target.value as Property["listingType"] })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]">
                <option value="sale">For sale</option>
                <option value="rent">For rent</option>
              </select></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Province<input name="province" value={form.province} onChange={(event) => setForm({ ...form, province: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label>
              <label className="block text-sm font-medium">Availability<select name="status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Property["status"] })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]"><option value="available">Available</option><option value="reserved">Reserved</option><option value="under_offer">Under offer</option><option value="sold">Sold</option><option value="rented">Rented</option><option value="unavailable">Unavailable</option><option value="draft">Draft</option></select></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Price (ZMW)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" required /></label>
              <label className="block text-sm font-medium">Location<input name="location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" required /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-medium">Bedrooms<input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={(event) => setForm({ ...form, bedrooms: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label>
              <label className="block text-sm font-medium">Bathrooms<input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={(event) => setForm({ ...form, bathrooms: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label>
              <label className="block text-sm font-medium">Area (m²)<input name="area" type="number" min="0" step="0.01" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label>
            </div>
            <label className="block text-sm font-medium">Description<textarea name="description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" rows={4} /></label>
            <label className="block text-sm font-medium">Image URL<input name="imageUrl" type="url" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Property owner<input name="ownerName" value={form.ownerName} onChange={(event) => setForm({ ...form, ownerName: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label><label className="block text-sm font-medium">Owner phone<input name="ownerPhone" type="tel" value={form.ownerPhone} onChange={(event) => setForm({ ...form, ownerPhone: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3 py-2.5 text-[#17212F]" /></label></div>
            {result.message && <p role={result.status === "error" ? "alert" : "status"} className="text-sm text-[#526174]">{result.message}</p>}
            <button type="submit" disabled={pending || !organizationId} className="brand-button-primary w-full rounded-xl px-4 py-3 text-sm font-medium text-white disabled:opacity-60">{pending ? "Saving…" : "Save property"}</button>
          </div>
        </form>
  );
}
