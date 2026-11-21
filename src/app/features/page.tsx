import { EditorialIntro } from "@/components/editorial-intro";
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
    description: "Create and update private property records with price, location, a photo link, owner details and availability.",
    icon: Building2,
    points: ["Sale and rent record types", "Status and property details", "Workspace portfolio view"],
  },
  {
    title: "Contacts and client notes",
    description: "Keep buyer, seller and other contact details in a workspace list, with notes, lead source and stated budget.",
    icon: ContactRound,
    points: ["Contact profile basics", "Client notes and source", "Budget field for follow-up context"],
  },
  {
    title: "Lead management and pipeline",
    description: "Create leads and move them through a defined set of sales stages so the next step is easier to see.",
    icon: CircleDashed,
    points: ["New through negotiation", "Converted and lost stages", "Administrator-controlled assignment"],
  },
  {
    title: "Workspace overview and reports",
    description: "Review summaries calculated from the agency’s shared property, lead, and deal records.",
    icon: BarChart3,
    points: ["Property record counts", "Lead and deal summaries", "Completed sale value by date"],
  },
  { title: "Viewings and follow-ups", description: "Schedule viewings and record outcomes. Track due dates for the next customer or property follow-up.", icon: CalendarDays, points: ["Viewing feedback", "Customer follow-up tasks", "Africa/Lusaka scheduling"] },
  { title: "Team invitations", description: "Agency administrators can invite agents, deactivate access and assign leads to active staff.", icon: Users, points: ["Email-matched invitations", "Active membership checks", "Agency administrator and agent access"] },
];

const planned = [
  { title: "Rental and tenant management", description: "Tenancy records, rent collection and maintenance workflows are not implemented.", icon: Building2 },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main>
        <EditorialIntro label="Platform capabilities" title="The building blocks for clearer property operations." image="office">
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-ink sm:text-lg sm:leading-8">
              Manage inventory, enquiries, viewings and transactions in your agency workspace.
            </p>
        </EditorialIntro>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-18">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-forest sm:text-3xl">Workspace capabilities</h2>
              <p className="mt-2 text-sm text-muted-ink">Account and operational records are server-backed and isolated by active agency membership.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {available.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                  <div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-pine">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-ink">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-ink">{feature.description}</p>
                    <ul className="mt-4 space-y-2">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-muted-ink">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-pine" aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-line bg-canvas">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-ink">In development</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-forest sm:text-3xl">Not every workflow is ready yet.</h2>
              <p className="mt-3 text-sm leading-6 text-muted-ink">The current workspace supports rental deals and landlord contact records. Tenancy administration is a future capability.</p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {planned.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded-2xl border border-line bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <Icon className="h-5 w-5 text-muted-ink" aria-hidden="true" />
                      <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-medium text-muted-ink">Not available</span>
                    </div>
                    <h3 className="mt-4 font-semibold text-ink">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-ink">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-5 rounded-[24px] bg-forest p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint">Take a closer look</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Explore the current workspace screens.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Sign-up and stored records are demonstrations only; avoid entering sensitive or production customer data.</p>
            </div>
            <Link href="/register" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-forest hover:bg-soft">
              Create a workspace <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
