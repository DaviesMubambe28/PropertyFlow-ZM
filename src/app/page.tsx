import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductTour } from "@/components/product-tour";
import { demoProperties } from "@/lib/demo-properties";
import { formatCurrency } from "@/lib/tenant";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const workflows = [
  { title: "Manage your property portfolio", body: "Keep listing details and availability current across your agency.", href: "/features", image: "/demo/house.jpg" },
  { title: "Follow up with buyers and tenants", body: "Assign enquiries, schedule viewings and keep the next step clear.", href: "/solutions", image: "/demo/apartment.jpg" },
  { title: "Keep the whole team in view", body: "Review deal progress, activity and access across your workspace.", href: "/enterprise", image: "/demo/office.jpg" },
];

const outlineLink = "inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[#c7d1cb] px-5 py-2 text-sm font-semibold text-[#192f28] transition-colors hover:bg-[#eef3ef]";
const primaryLink = "inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-[#174b3e] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103529]";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#192f28]">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-x-14 px-5 pt-11 pb-14 sm:px-8 sm:pt-16 md:grid-cols-[.9fr_1.1fr] md:pb-20 lg:gap-x-20">
          <div>
            <p className="text-sm font-semibold text-[#356252]">For Zambian real estate agencies</p>
            <h1 className="mt-4 max-w-[13ch] text-[clamp(2.65rem,5.4vw,5rem)] font-semibold leading-[1.02] tracking-[-.07em]">Run your agency from one workspace.</h1>
            <p className="mt-5 max-w-[36ch] text-base leading-7 text-[#465951] sm:text-lg">Manage listings, assign enquiries, schedule viewings and track deals from first contact to close.</p>
          </div>
          <figure className="relative mt-7 grid aspect-[1.5] grid-cols-[1.1fr_1fr] grid-rows-2 gap-2 sm:gap-3 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0">
            <div className="relative row-span-2 my-[8%] overflow-hidden rounded-2xl bg-[#d8e1da] sm:rounded-[1.75rem]">
              <Image src="/demo/house.jpg" alt="Contemporary home with a landscaped garden" fill sizes="(max-width: 767px) 50vw, 27vw" className="object-cover object-[38%_center]" preload />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-[#d8e1da] sm:rounded-[1.75rem]">
              <Image src="/demo/apartment.jpg" alt="Light-filled apartment interior" fill sizes="(max-width: 767px) 46vw, 24vw" className="object-cover" />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-[#d8e1da] sm:rounded-[1.75rem]">
              <Image src="/demo/office.jpg" alt="Open-plan commercial office" fill sizes="(max-width: 767px) 46vw, 24vw" className="object-cover" />
            </div>
            <figcaption className="sr-only">Illustrative property photographs</figcaption>
          </figure>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5 md:justify-start md:self-start">
            <Link href="/contact" className={primaryLink}>Request a demo <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="#product-tour" className={outlineLink}>Explore the platform <ArrowDown size={15} aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 md:pb-20" aria-labelledby="example-properties">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="example-properties" className="text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Explore example properties</h2>
              <p className="mt-2 text-sm text-[#465951]">See how residential and commercial listings are presented.</p>
            </div>
            <Link href="/properties" className={outlineLink}>Browse properties <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ul className="mt-6 grid snap-x snap-mandatory auto-cols-[81%] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain px-1 pt-1 pb-3 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-3 sm:gap-5 sm:overflow-visible">
            {demoProperties.map((property) => (
              <li key={property.id} className="min-w-0 snap-start">
                <Link href={`/properties/${property.id}`} className="group block rounded-2xl">
                  <div className="relative aspect-[1.23] overflow-hidden rounded-2xl bg-[#d8e1da]">
                    <Image src={property.imageUrl} alt="" fill sizes="(max-width: 639px) 81vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.035] motion-reduce:transform-none" />
                    <span className="absolute top-3 left-3 rounded-full bg-[#faf9f5] px-3 py-1 text-xs font-semibold">{property.listingType === "sale" ? "For sale" : "To rent"}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight group-hover:underline">{property.title}</h3>
                  <p className="mt-1 text-sm text-[#465951]">{property.location}</p>
                  <p className="mt-1 text-sm font-semibold">{formatCurrency(property.price)}{property.listingType === "rent" && " / month"}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-y border-[#e2e7df] bg-[#f0f3ed]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
            <h2 className="text-3xl font-semibold tracking-[-.05em] sm:text-4xl">From first enquiry to completed deal</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-[1.15fr_1fr] md:gap-9">
              <Link href={workflows[0].href} className="group block rounded-2xl">
                <div className="relative aspect-[2.1] overflow-hidden rounded-2xl bg-[#d8e1da]">
                  <Image src={workflows[0].image} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover object-[center_60%]" />
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight group-hover:underline">{workflows[0].title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#465951]">{workflows[0].body}</p>
              </Link>
              <ul className="divide-y divide-[#d5dfd6] border-y border-[#d5dfd6]">
                {workflows.slice(1).map((workflow) => (
                  <li key={workflow.href}>
                    <Link href={workflow.href} className="group grid grid-cols-[5.25rem_1fr_auto] items-center gap-3 py-4 sm:grid-cols-[7rem_1fr_auto] sm:gap-4">
                      <div className="relative aspect-[1.25] overflow-hidden rounded-xl bg-[#d8e1da]">
                        <Image src={workflow.image} alt="" fill sizes="112px" className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold leading-tight group-hover:underline">{workflow.title}</h3>
                        <p className="mt-1 text-sm leading-5 text-[#465951]">{workflow.body}</p>
                      </div>
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
          <h2 className="mb-5 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Take a look inside the workspace</h2>
          <ProductTour />
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 md:pb-20">
          <h2 className="text-2xl font-semibold tracking-tight">Questions about getting started</h2>
          <div className="mt-4 max-w-3xl divide-y divide-[#d5dfd6] border-y border-[#d5dfd6]">
            <details className="py-4">
              <summary className="cursor-pointer font-semibold">Can independent agents use it?</summary>
              <p className="mt-2 text-sm leading-6 text-[#465951]">Yes. You can use a workspace to manage your own properties, contacts, viewings and deals.</p>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer font-semibold">How can I evaluate it with my team?</summary>
              <p className="mt-2 text-sm leading-6 text-[#465951]">Request an enterprise demo to discuss your workflows and review the <Link href="/pricing" className="font-semibold underline">indicative plans</Link>.</p>
            </details>
          </div>
        </section>
        <section className="bg-[#173b31] px-5 py-13 text-center text-white sm:px-8">
          <h2 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">See PropertyFlow ZM with your team.</h2>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#e2efe2] px-5 text-sm font-semibold text-[#173b31] hover:bg-white">Request a demo <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/pricing" className="inline-flex min-h-11 items-center rounded-full border border-white/50 px-5 text-sm font-semibold hover:bg-white/10">See workspace plans</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
