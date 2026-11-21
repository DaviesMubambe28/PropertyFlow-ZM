"use client";

import { EditorialIntro } from "@/components/editorial-intro";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BedDouble, MapPin, Maximize2, Search, SlidersHorizontal } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { demoProperties } from "@/lib/demo-properties";
import { formatCurrency } from "@/lib/tenant";

export default function PropertiesPage() {
  const [query, setQuery] = useState("");
  const [listingType, setListingType] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const activeProperties = demoProperties.filter((property) => property.status === "available");
  const propertyTypes = [...new Set(activeProperties.map((property) => property.type))].sort();
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedLocation = location.trim().toLowerCase();
  const priceLimit = maxPrice === "" ? null : Number(maxPrice);
  const visibleProperties = activeProperties.filter((property) => (
      (!normalizedQuery || `${property.title} ${property.location} ${property.description}`.toLowerCase().includes(normalizedQuery))
      && (listingType === "all" || property.listingType === listingType)
      && (propertyType === "all" || property.type === propertyType)
      && (!normalizedLocation || property.location.toLowerCase().includes(normalizedLocation))
      && (priceLimit === null || (Number.isFinite(priceLimit) && property.price <= priceLimit))
  ));

  function clearFilters() {
    setQuery("");
    setListingType("all");
    setPropertyType("all");
    setLocation("");
    setMaxPrice("");
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main>
        <EditorialIntro label="Property discovery" title="Explore property records" image="house">
          <p className="mt-4 max-w-md leading-7 text-muted-ink">Browse example listings by location, property type and asking price.</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-ink">Listings are synthetic examples. Availability and prices are illustrative.</p>
        </EditorialIntro>

        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:px-6 lg:grid-cols-[250px_1fr] lg:gap-9 lg:py-10">
          <aside className="h-fit rounded-2xl border border-line bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-pine" aria-hidden="true" />
              <h2 className="font-semibold text-ink">Filter listings</h2>
            </div>
            <div className="mt-5 grid grid-cols-2 items-end gap-3 lg:grid-cols-1 lg:gap-4">
              <div className="col-span-2 lg:col-span-1">
                <label htmlFor="property-search" className="mb-1.5 block text-xs font-medium text-muted-ink">Search</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A96A5]" aria-hidden="true" />
                  <input id="property-search" value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-xl border border-line bg-field py-2.5 pl-9 pr-3 text-sm text-ink" placeholder="Title or keyword" />
                </div>
              </div>
              <div>
                <label htmlFor="listing-type" className="mb-1.5 block text-xs font-medium text-muted-ink">Listing type</label>
                <select id="listing-type" value={listingType} onChange={(event) => setListingType(event.target.value)} className="w-full rounded-xl border border-line bg-field px-3 py-2.5 text-sm text-ink">
                  <option value="all">Sale and rent</option>
                  <option value="sale">For sale</option>
                  <option value="rent">For rent</option>
                </select>
              </div>
              <div>
                <label htmlFor="property-type" className="mb-1.5 block text-xs font-medium text-muted-ink">Property type</label>
                <select id="property-type" value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className="w-full rounded-xl border border-line bg-field px-3 py-2.5 text-sm text-ink">
                  <option value="all">All property types</option>
                  {propertyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="location-filter" className="mb-1.5 block text-xs font-medium text-muted-ink">Location</label>
                <input id="location-filter" value={location} onChange={(event) => setLocation(event.target.value)} className="w-full rounded-xl border border-line bg-field px-3 py-2.5 text-sm text-ink" placeholder="e.g. Lusaka" />
              </div>
              <div>
                <label htmlFor="max-price" className="mb-1.5 block text-xs font-medium text-muted-ink">Maximum price (ZMW)</label>
                <input id="max-price" type="number" min="0" inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="w-full rounded-xl border border-line bg-field px-3 py-2.5 text-sm text-ink" placeholder="No maximum" />
              </div>
              <button type="button" onClick={clearFilters} className="col-span-2 w-full rounded-xl border border-line px-3 py-2.5 text-sm font-medium lg:col-span-1 text-muted-ink hover:bg-canvas">
                Clear filters
              </button>
            </div>
          </aside>

          <section aria-labelledby="results-heading">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 id="results-heading" className="font-semibold text-ink">Example listings</h2>
              <p className="text-sm text-muted-ink">{visibleProperties.length} {visibleProperties.length === 1 ? "record" : "records"}</p>
            </div>
            {visibleProperties.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {visibleProperties.map((property, index) => (
                  <article key={property.id} className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <Link href={`/properties/${property.id}`} className="group block" aria-label={`View example listing: ${property.title}`}>
                      <div className="relative h-52 bg-sage">
                        <Image
                          src={property.imageUrl}
                          alt={`Example photo for ${property.title}`}
                          fill
                          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                          loading={index === 0 ? "eager" : "lazy"}
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-pine">
                          {property.listingType === "rent" ? "For rent" : "For sale"}
                        </span>
                        <span className="absolute right-3 top-3 rounded-full bg-forest/80 px-2.5 py-1 text-[10px] font-medium text-white">Demo</span>
                      </div>
                      <div className="p-5">
                        <p className="text-lg font-semibold tabular-nums text-pine">{formatCurrency(property.price)}{property.listingType === "rent" ? <span className="text-xs font-normal text-muted-ink"> / month</span> : null}</p>
                        <h3 className="mt-2 line-clamp-1 text-base font-semibold text-ink">{property.title}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-ink">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-pine" aria-hidden="true" /> {property.location}
                        </p>
                        <div className="mt-4 flex items-center gap-4 border-t border-line pt-3 text-xs text-muted-ink">
                          {property.bedrooms > 0 && <span className="inline-flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" aria-hidden="true" />{property.bedrooms} beds</span>}
                          {property.bathrooms > 0 && <span>{property.bathrooms} baths</span>}
                          {property.area > 0 && <span className="inline-flex items-center gap-1"><Maximize2 className="h-3 w-3" aria-hidden="true" />{property.area} m²</span>}
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pine">
                          View details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#CDD7E0] bg-white px-5 py-12 text-center">
                <Search className="mx-auto h-6 w-6 text-[#8A96A5]" aria-hidden="true" />
                <h3 className="mt-4 font-semibold text-ink">No matching example listings</h3>
                <p className="mt-2 text-sm text-muted-ink">Try another search or clear some filters.</p>
                <button type="button" onClick={clearFilters} className="mt-5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-canvas">Clear filters</button>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
