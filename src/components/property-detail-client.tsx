"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BedDouble, MapPin, Maximize2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useAppContext } from "@/components/app-provider";
import { formatCurrency } from "@/lib/tenant";

export function PropertyDetailClient({ id }: { id: string }) {
  const { state } = useAppContext();
  const property = state.properties.find((item) => item.id === id && item.status === "active");

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#17212F]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12">
        <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-medium text-[#526174] hover:text-[#142A43]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to property records
        </Link>

        {property ? (
          <>
            <div className="mt-6 rounded-xl border border-[#E8D9B7] bg-[#FFF9ED] px-4 py-3 text-sm leading-6 text-[#76500A]">
              Demonstration listing only. This property, its availability and its price have not been verified and are not an offer for sale or rent.
            </div>
            <div className="mt-5 grid gap-7 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-[#E8EEF2] sm:min-h-[420px]">
                <Image src={property.imageUrl} alt={`Example photo for ${property.title}`} fill sizes="(max-width: 1023px) 100vw, 65vw" loading="eager" unoptimized className="object-cover" />
              </div>
              <section className="rounded-2xl border border-[#E5EAF0] bg-white p-5 sm:p-7">
                <span className="inline-flex rounded-full bg-[#EAF6F7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#087F8C]">
                  {property.listingType === "rent" ? "For rent" : "For sale"}
                </span>
                <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-[#0B192A] sm:text-3xl">{property.title}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#667085]">
                  <MapPin className="h-4 w-4 text-[#087F8C]" aria-hidden="true" /> {property.location}
                </p>
                <p className="mt-6 text-2xl font-semibold tabular-nums text-[#142A43]">
                  {formatCurrency(property.price)}
                  {property.listingType === "rent" && <span className="text-sm font-normal text-[#667085]"> / month</span>}
                </p>
                <div className="mt-6 flex flex-wrap gap-4 border-y border-[#E5EAF0] py-4 text-sm text-[#526174]">
                  {property.bedrooms > 0 && <span className="inline-flex items-center gap-1.5"><BedDouble className="h-4 w-4" aria-hidden="true" />{property.bedrooms} bedrooms</span>}
                  {property.bathrooms > 0 && <span>{property.bathrooms} bathrooms</span>}
                  {property.area > 0 && <span className="inline-flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />{property.area} m²</span>}
                </div>
                <h2 className="mt-5 text-sm font-semibold text-[#17212F]">Description</h2>
                <p className="mt-2 text-sm leading-6 text-[#667085]">{property.description}</p>
                <div className="mt-6 rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] p-3 text-xs leading-5 text-[#667085]">
                  Public enquiries are not connected in this prototype. No agent or owner contact details are available here.
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-[#CDD7E0] bg-white px-5 py-14 text-center">
            <h1 className="text-xl font-semibold text-[#17212F]">Property record not found</h1>
            <p className="mt-2 text-sm text-[#667085]">It may have been removed or is no longer active.</p>
            <Link href="/properties" className="brand-button-primary mt-5 inline-flex rounded-full px-4 py-2.5 text-sm font-semibold text-white">Browse property records</Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
