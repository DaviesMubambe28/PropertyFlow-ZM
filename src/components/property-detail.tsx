import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BedDouble, MapPin, Maximize2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/tenant";

export function PropertyDetail({ property }: { property: Property }) {

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12">
        <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-medium text-muted-ink hover:text-pine">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to property records
        </Link>

        <header className="my-6 border-b border-line pb-5 sm:my-8">
          <h1 className="text-[clamp(2.35rem,5vw,4.35rem)] font-semibold leading-[1.04] tracking-[-.06em] text-forest">{property.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-ink">
            <MapPin className="h-4 w-4 text-pine" aria-hidden="true" /> {property.location}
          </p>
          <p className="mt-3 text-sm text-muted-ink">Example listing for demonstration. Availability and price are illustrative.</p>
        </header>
        <div className="mt-5 grid gap-7 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="relative aspect-[1.35] overflow-hidden rounded-[1.65rem] bg-sage lg:aspect-auto lg:min-h-[450px]">
            <Image src={property.imageUrl} alt={`Example photo for ${property.title}`} fill sizes="(max-width: 1023px) 100vw, 65vw" loading="eager" className="object-cover" />
          </div>
          <section className="rounded-[1.65rem] border border-line bg-white p-5 sm:p-7">
            <span className="inline-flex rounded-full bg-sage px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-pine">
              {property.listingType === "rent" ? "For rent" : "For sale"}
            </span>
            <p className="mt-6 text-2xl font-semibold tabular-nums text-pine">
              {formatCurrency(property.price)}
              {property.listingType === "rent" && <span className="text-sm font-normal text-muted-ink"> / month</span>}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 border-y border-line py-4 text-sm text-muted-ink">
              {property.bedrooms > 0 && <span className="inline-flex items-center gap-1.5"><BedDouble className="h-4 w-4" aria-hidden="true" />{property.bedrooms} bedrooms</span>}
              {property.bathrooms > 0 && <span>{property.bathrooms} bathrooms</span>}
              {property.area > 0 && <span className="inline-flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />{property.area} m²</span>}
            </div>
            <h2 className="mt-5 text-sm font-semibold text-ink">Description</h2>
            <p className="mt-2 text-sm leading-6 text-muted-ink">{property.description}</p>
            <div className="mt-6 rounded-xl border border-line bg-field p-3 text-xs leading-5 text-muted-ink">
              Browse this example to see how listing details are presented.
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
