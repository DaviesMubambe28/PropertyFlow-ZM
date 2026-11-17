import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  CircleDashed,
  ContactRound,
  Users,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const available = [
  {
    title: "Property and listing management",
    description: "Create property records with listing type, price, location, photos, description and availability status. Public discovery only shows active records.",
    icon: Building2,
    tag: "Prototype UI available",
    points: ["Sale and rent record types", "Status and property details", "Workspace portfolio view"],
  },
  {
    title: "Contacts and client notes",
    description: "Keep buyer, seller and other contact details in a workspace list, with notes, lead source and stated budget.",
    icon: ContactRound,
    tag: "Prototype UI available",
    points: ["Contact profile basics", "Client notes and source", "Budget field for follow-up context"],
  },
  {
    title: "Lead management and pipeline",
    description: "Create leads and move them through a defined set of sales stages so the next step is easier to see.",
    icon: CircleDashed,
    tag: "Prototype UI available",
    points: ["New through negotiation", "Won and lost stages", "Estimated lead value"],
  },
  {
    title: "Workspace overview and reports",
    description: "Review summaries calculated from the current browser’s workspace records. These are not shared or production analytics.",
    icon: BarChart3,
    tag: "Local prototype data",
    points: ["Property record counts", "Lead and deal summaries", "Workspace subscription examples"],
  },
];

const planned = [
  { title: "Viewings and appointments", description: "The data model has viewing records, but a complete scheduling and calendar workflow is not yet available.", icon: CalendarDays },
  { title: "Team invitations", description: "Verified agency membership is connected; invitation and team-management screens are still being completed.", icon: Users },
  { title: "Rental and tenant management", description: "Tenancy records, rent collection and maintenance workflows are not implemented.", icon: Building2 },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-[#17212F]">
      <SiteHeader />
      <main>
        <section className="bg-[#F7F9FC]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Platform capabilities</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#0B192A] sm:text-5xl">
              The building blocks for clearer property operations.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
              Explore the workflows represented in PropertyFlow ZM today. Available prototype screens and planned capabilities are intentionally distinguished.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#E5EAF0] bg-white px-3 py-1.5 text-xs font-medium text-[#667085]">
              <span className="h-2 w-2 rounded-full bg-[#C77D0A]" />
              Secure shared identity — operational modules remain browser-local
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-18">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0B192A] sm:text-3xl">Available in the prototype</h2>
              <p className="mt-2 text-sm text-[#667085]">Account access is server-backed; the operational screens below still use local browser data.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {available.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="grid gap-5 rounded-2xl border border-[#E5EAF0] bg-white p-5 sm:grid-cols-[1fr_auto] sm:p-6">
                  <div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6F7] text-[#087F8C]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-[#17212F]">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#667085]">{feature.description}</p>
                    <ul className="mt-4 space-y-2">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-[#526174]">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#087F8C]" aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="h-fit whitespace-nowrap rounded-full bg-[#F1F5F8] px-2.5 py-1 text-[10px] font-medium text-[#526174]">{feature.tag}</span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-[#E5EAF0] bg-[#F7F9FC]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">In development</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0B192A] sm:text-3xl">Not every workflow is ready yet.</h2>
              <p className="mt-3 text-sm leading-6 text-[#667085]">These are not presented as working features in this prototype.</p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {planned.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded-2xl border border-[#E5EAF0] bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <Icon className="h-5 w-5 text-[#667085]" aria-hidden="true" />
                      <span className="rounded-full border border-[#E5EAF0] px-2.5 py-1 text-[10px] font-medium text-[#667085]">Not available</span>
                    </div>
                    <h3 className="mt-4 font-semibold text-[#17212F]">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#667085]">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-5 rounded-[24px] bg-[#0B192A] p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A7DADC]">Take a closer look</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Explore the current workspace screens.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Sign-up and stored records are demonstrations only; avoid entering sensitive or production customer data.</p>
            </div>
            <Link href="/register" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0B192A] hover:bg-[#F1F5F8]">
              Try the prototype <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
