"use client";

import Link from "next/link";
import { ArrowRight, Building2, CalendarClock, ContactRound, FolderKanban, ListChecks } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";

const links = [
  { label: "Add a property", href: "/dashboard/properties#property-form", icon: Building2 },
  { label: "Create a lead", href: "/dashboard/pipeline#lead-form", icon: ContactRound },
  { label: "Schedule a viewing", href: "/dashboard/activities#viewing-form", icon: CalendarClock },
];

const dateFormat = new Intl.DateTimeFormat("en-ZM", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lusaka" });

export default function DashboardOverviewPage() {
  const { state, activeOrg, currentUser } = useAppContext();
  const id = activeOrg?.id;
  const properties = state.properties.filter((item) => item.orgId === id && item.status === "available");
  const leads = state.leads.filter((item) => item.orgId === id && item.stage !== "converted" && item.stage !== "lost");
  const deals = state.deals.filter((item) => item.orgId === id && item.status === "open");
  const tasks = state.tasks.filter((item) => item.orgId === id && item.status !== "done");
  const viewings = state.viewings.filter((item) => item.orgId === id && item.status === "scheduled");
  const work = [
    ...tasks.map((item) => ({ key: `task-${item.id}`, at: item.dueDate, title: item.title, type: "Follow-up" })),
    ...viewings.map((item) => ({
      key: `viewing-${item.id}`, at: item.date, type: "Viewing",
      title: state.properties.find((property) => property.id === item.propertyId)?.title ?? "Property viewing",
    })),
  ].sort((a, b) => a.at.localeCompare(b.at));

  const metrics = [
    { label: "Available listings", value: properties.length, icon: Building2, href: "/dashboard/properties?status=available" },
    { label: "Active leads", value: leads.length, icon: ContactRound, href: "/dashboard/pipeline?status=active" },
    { label: "Open deals", value: deals.length, icon: FolderKanban, href: "/dashboard/activities?status=open#deals" },
    { label: "Open follow-ups", value: tasks.length, icon: ListChecks, href: "/dashboard/activities?status=open#follow-ups" },
  ];
  const pipeline = [
    { title: "New", key: "new" },
    { title: "Contacted", key: "contacted" },
    { title: "Interested", key: "interested" },
    { title: "Viewing scheduled", key: "viewing_scheduled" },
    { title: "Negotiation", key: "negotiation" },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <section className="rounded-[1.65rem] border border-line bg-sage px-5 py-6 text-forest sm:px-8 sm:py-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{currentUser?.role === "agent" ? "Your workspace overview" : "Agency overview"}</h2>
          <p className="mt-2 text-sm text-muted-ink">Review inventory, deal progress and work coming due.</p>
          <nav className="mt-5 flex flex-wrap gap-2" aria-label="Quick actions">
            {links.map(({ label, href, icon: Icon }) => <Link key={label} href={href} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-pine/30 px-3 text-xs font-semibold hover:bg-white"><Icon size={16} aria-hidden="true" />{label}</Link>)}
          </nav>
        </section>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon, href }) => <Link key={label} href={href} className="rounded-xl border border-line bg-white p-3 hover:border-teal-600 sm:p-5">
            <div className="flex items-start justify-between gap-1"><p className="text-sm font-medium text-muted-ink">{label}</p><Icon size={17} className="shrink-0 text-pine" aria-hidden="true" /></div>
            <p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p>
          </Link>)}
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
          <section className="rounded-xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">Pending work</h2><Link href="/dashboard/activities?status=open#follow-ups" className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine">Activities <ArrowRight size={14} aria-hidden="true" /></Link></div>
            {work.length === 0 ? <p className="mt-4 text-sm text-muted-ink">No scheduled viewings or open follow-ups.</p> : <ul className="mt-3 divide-y divide-line">
              {work.slice(0, 6).map((item) => <li key={item.key} className="py-3"><p className="text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-muted-ink">{item.type} · <time dateTime={item.at}>{dateFormat.format(new Date(item.at))}</time></p></li>)}
            </ul>}
          </section>
          <section className="rounded-xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">Active lead stages</h2><Link href="/dashboard/pipeline?status=active" className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine">Pipeline <ArrowRight size={14} aria-hidden="true" /></Link></div>
            <ul className="mt-4 space-y-3">
              {pipeline.map(({ title, key }) => {
                const count = leads.filter((lead) => lead.stage === key).length;
                return <li key={key} className="grid grid-cols-[8rem_1fr_1.25rem] items-center gap-2 text-xs text-ink sm:text-sm">{title}<div className="h-2 rounded-full bg-soft" aria-hidden="true"><div className="h-full rounded-full bg-teal-700" style={{ width: `${leads.length ? count / leads.length * 100 : 0}%` }} /></div><span className="text-right tabular-nums">{count}</span></li>;
              })}
            </ul>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
