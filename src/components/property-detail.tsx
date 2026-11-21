import { ListingPhoto } from "@/components/listing-photo";
import type { PublicListing } from "@/lib/public-listing";
import Link from "next/link";
import { ArrowLeft, BedDouble, MapPin, Maximize2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/tenant";

export function PropertyDetail({ property }: { property: PublicListing }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main className="site-width py-8 sm:py-12">
        <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-medium text-quiet hover:text-deep">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to property listings
        </Link>

        <div className="mt-5 grid gap-7 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="relative min-h-[280px] overflow-hidden rounded-lg bg-[#E8EEF2] sm:min-h-[420px]">
            <ListingPhoto src={property.imageUrl} title={property.title} sizes="(max-width: 1023px) 100vw, 65vw" />
          </div>
          <section className="rounded-lg border border-line bg-white p-5 sm:p-7">
            <span className="inline-flex rounded-full bg-tint px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
              {property.listingType === "rent" ? "For rent" : "For sale"}
            </span>
            <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-deep sm:text-3xl">{property.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-quiet">
              <MapPin className="h-4 w-4 text-brand" aria-hidden="true" /> {property.location}
            </p>
            <p className="mt-6 text-2xl font-semibold tabular-nums text-deep">
              {formatCurrency(property.price)}
              {property.listingType === "rent" && <span className="text-sm font-normal text-quiet"> / month</span>}
            </p>
            {(property.bedrooms > 0 || property.bathrooms > 0 || property.area > 0) && (
              <div className="mt-6 flex flex-wrap gap-4 border-y border-line py-4 text-sm text-quiet">
                {property.bedrooms > 0 && <span className="inline-flex items-center gap-1.5"><BedDouble className="h-4 w-4" aria-hidden="true" />{property.bedrooms} bedrooms</span>}
                {property.bathrooms > 0 && <span>{property.bathrooms} bathrooms</span>}
                {property.area > 0 && <span className="inline-flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />{property.area} m²</span>}
              </div>
            )}
            {property.description.trim() && (
              <>
                <h2 className="mt-5 text-sm font-semibold text-ink">Description</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-quiet">{property.description}</p>
              </>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
