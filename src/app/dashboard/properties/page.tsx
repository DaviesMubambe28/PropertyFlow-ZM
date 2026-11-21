"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { Suspense, useActionState, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";
import type { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/tenant";
import { createProperty, initialOperationState, updateProperty } from "@/actions/operations";

export default function PropertiesPage() {
  return <Suspense fallback={<DashboardShell><p role="status">Loading portfolio…</p></DashboardShell>}><PropertyPortfolio /></Suspense>;
}

function PropertyPortfolio() {
  const { state, activeOrg } = useAppContext();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") === "available" ? "available" : "");
  const [editing, setEditing] = useState<Property | null>(null);
  const orgProperties = state.properties.filter((property) => property.orgId === activeOrg?.id);

  const currentEdit = editing?.orgId === activeOrg?.id ? editing : null;
  const query = search.trim().toLowerCase();
  const visibleProperties = orgProperties.filter((property) =>
    (!status || property.status === status) &&
    [property.title, property.location, property.province].some((field) => (field ?? "").toLowerCase().includes(query)),
  );

  return (
    <DashboardShell>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0 scroll-mt-24 rounded-lg border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-ink">Property portfolio</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">Search properties
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} className="rounded-lg border border-slate-300 p-2" placeholder="Title, location or province" />
            </label>
            <label className="grid gap-1 text-sm font-medium">Status
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-300 p-2">
                <option value="">All statuses</option><option value="available">Available</option><option value="reserved">Reserved</option><option value="under_offer">Under offer</option><option value="sold">Sold</option><option value="rented">Rented</option><option value="unavailable">Unavailable</option><option value="draft">Draft</option>
              </select>
            </label>
          </div>
          <div className="mt-6 space-y-4">
            {visibleProperties.map((property, index) => (
              <div key={property.id} className="flex gap-4 rounded-lg border border-line bg-canvas p-3">
                {property.imageUrl ? (
                  <Image src={property.imageUrl} alt="" width={96} height={80} loading={index === 0 ? "eager" : "lazy"} unoptimized className="h-20 w-24 rounded-xl object-cover" />
                ) : (
                  <span aria-label="No property photo" role="img" className="grid h-20 w-24 shrink-0 place-items-center rounded-xl bg-slate-200 text-quiet"><Building2 aria-hidden="true" /></span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate font-semibold text-ink">{property.title}</p>
                    <span className="shrink-0 rounded-full bg-tint px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#16803C]">{property.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-quiet">{property.location}</p>
                  <p className="mt-2 text-sm font-medium text-ink">{formatCurrency(property.price)}</p>
                  {property.updatedAt && (
                    <a href="#add-property" className="mt-2 inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-3 text-sm font-medium text-deep" onClick={() => setEditing(property)}>
                      Edit <span className="sr-only">{property.title}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
            {orgProperties.length > 0 && !visibleProperties.length && <p role="status" className="text-sm text-quiet">No properties match these filters.</p>}
            {orgProperties.length === 0 && <p role="status" className="rounded-xl border border-dashed border-line p-6 text-sm text-quiet">No properties yet. Add the first listing for this agency.</p>}
          </div>
        </div>

        <PropertyForm key={currentEdit?.id ?? activeOrg?.id ?? "new"} organizationId={activeOrg?.id ?? ""} property={currentEdit} cancel={() => setEditing(null)} />
      </div>
    </DashboardShell>
  );
}

function PropertyForm({ organizationId, property, cancel }: { organizationId: string; property: Property | null; cancel: () => void }) {
  const [result, formAction, pending] = useActionState(property ? updateProperty : createProperty, initialOperationState);
  const [form, setForm] = useState({
    title: property?.title ?? "",
    type: property?.type ?? "Residential house",
    listingType: String(property?.listingType ?? "sale"),
    price: property ? String(property.price) : "",
    location: property?.location ?? "Lusaka",
    province: property?.province ?? "Lusaka",
    bedrooms: property ? String(property.bedrooms) : "",
    bathrooms: property ? String(property.bathrooms) : "",
    area: property ? String(property.area) : "",
    description: property?.description ?? "",
    imageUrl: property?.imageUrl ?? "",
    status: String(property?.status ?? "available"),
    ownerName: property?.ownerName ?? "",
    ownerPhone: property?.ownerPhone ?? "",
  });

  return (
    <form id="add-property" action={formAction} className="min-w-0 scroll-mt-24 rounded-lg border border-line bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-semibold text-ink">{property ? "Edit property" : "Add property"}</h3>
        {property && <button type="button" onClick={cancel} className="brand-button-secondary min-h-11 rounded-lg px-3 text-sm">Cancel edit</button>}
      </div>
      {property && <>
        <input type="hidden" name="propertyId" value={property.id} />
        <input type="hidden" name="updatedAt" value={property.updatedAt} />
      </>}
      <input type="hidden" name="organizationId" value={organizationId} />
      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium">Property title<input name="title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" required /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">Property type<input name="type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" required /></label>
          <label className="block text-sm font-medium">Listing type<select name="listingType" value={form.listingType} onChange={(event) => setForm({ ...form, listingType: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink">
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">Province<input name="province" value={form.province} onChange={(event) => setForm({ ...form, province: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label>
          <label className="block text-sm font-medium">Availability<select name="status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink"><option value="available">Available</option><option value="reserved">Reserved</option><option value="under_offer">Under offer</option><option value="sold">Sold</option><option value="rented">Rented</option><option value="unavailable">Unavailable</option><option value="draft">Draft</option></select></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">Price (ZMW)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" required /></label>
          <label className="block text-sm font-medium">Location<input name="location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" required /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-medium">Bedrooms<input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={(event) => setForm({ ...form, bedrooms: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label>
          <label className="block text-sm font-medium">Bathrooms<input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={(event) => setForm({ ...form, bathrooms: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label>
          <label className="block text-sm font-medium">Area (m²)<input name="area" type="number" min="0" step="0.01" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label>
        </div>
        <label className="block text-sm font-medium">Description<textarea name="description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" rows={4} /></label>
        <label className="block text-sm font-medium">Image URL<input name="imageUrl" type="url" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Property owner<input name="ownerName" value={form.ownerName} onChange={(event) => setForm({ ...form, ownerName: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label><label className="block text-sm font-medium">Owner phone<input name="ownerPhone" type="tel" value={form.ownerPhone} onChange={(event) => setForm({ ...form, ownerPhone: event.target.value })} className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink" /></label></div>
        {result.message && <p role={result.status === "error" ? "alert" : "status"} className="text-sm text-quiet">{result.message}</p>}
        <button type="submit" disabled={pending || !organizationId} className="brand-button-primary w-full rounded-xl px-4 py-3 text-sm font-medium text-white disabled:opacity-60">{pending ? "Saving…" : "Save property"}</button>
      </div>
    </form>
  );
}
