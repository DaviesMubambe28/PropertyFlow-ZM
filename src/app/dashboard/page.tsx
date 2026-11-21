"use client";

import Link from "next/link";
import { Building2, CalendarDays, FolderKanban, ListChecks } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";

export default function DashboardOverviewPage() {
  const { state, activeOrg, currentUser } = useAppContext();
  const orgProperties = state.properties.filter((property) => property.orgId === activeOrg?.id && property.status === "available");
  const pendingTasks = state.tasks.filter((task) => task.orgId === activeOrg?.id && task.status !== "done");
  const scheduledViewings = state.viewings.filter((viewing) => viewing.orgId === activeOrg?.id && viewing.status === "scheduled");
  const openDeals = state.deals.filter((deal) => deal.orgId === activeOrg?.id && deal.status === "open");

  const setupSteps = [
    { label: "Add your first property", href: "/dashboard/properties#add-property", complete: state.properties.some((item) => item.orgId === activeOrg?.id) },
    { label: "Create a client contact", href: "/dashboard/contacts", complete: state.contacts.some((item) => item.orgId === activeOrg?.id) },
    { label: "Record your first enquiry", href: "/dashboard/pipeline", complete: state.leads.some((item) => item.orgId === activeOrg?.id) },
  ];
  const remainingSetup = setupSteps.filter((step) => !step.complete);
  const cards = [
    { label: "Available properties", value: orgProperties.length, icon: Building2, href: "/dashboard/properties?status=available" },
    { label: "Pending follow-ups", value: pendingTasks.length, icon: ListChecks, href: "/dashboard/activities#tasks" },
    { label: "Scheduled viewings", value: scheduledViewings.length, icon: CalendarDays, href: "/dashboard/activities#viewings" },
    { label: "Open deals", value: openDeals.length, icon: FolderKanban, href: "/dashboard/activities#deals" },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {activeOrg && currentUser?.role === "owner" && remainingSetup.length > 0 && (
          <details open className="rounded-2xl border border-teal-200 bg-teal-50 p-5 text-[#142A43]">
            <summary className="cursor-pointer font-semibold">Set up your workspace · {setupSteps.length - remainingSetup.length} of {setupSteps.length} complete</summary>
            <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
              {remainingSetup.map((step) => (
                <li key={step.href}><Link href={step.href} className="inline-flex min-h-11 items-center underline decoration-teal-700 underline-offset-4">{step.label}</Link></li>
              ))}
            </ul>
          </details>
        )}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link href={card.href} key={card.label} className="rounded-2xl border border-[#E5EAF0] bg-white p-5 shadow-sm hover:border-teal-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#667085]">{card.label}</p>
                  <span className="rounded-xl bg-[#EAF6F7] p-2"><Icon className="h-4 w-4 text-[#087F8C]" /></span>
                </div>
                <p className="mt-5 text-3xl font-semibold text-[#17212F]">{card.value}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#17212F]">Recently added available properties</h2>
            <div className="mt-6 space-y-4">
              {orgProperties.slice(0, 3).map((property) => (
                <div key={property.id} className="flex items-center justify-between rounded-2xl bg-[#F7F9FC] p-3">
                  <div>
                    <p className="font-medium text-[#17212F]">{property.title}</p>
                    <p className="text-sm text-[#667085]">{property.location}</p>
                  </div>
                  <span className="rounded-full bg-[#EAF6F7] px-2.5 py-1 text-xs font-medium text-[#16803C]">{property.status}</span>
                </div>
              ))}
              {orgProperties.length === 0 && (
                <p className="rounded-xl border border-dashed border-[#E5EAF0] px-4 py-6 text-sm text-[#667085]">
                  No active properties in this workspace yet. Add a property to start your portfolio.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E5EAF0] bg-[#0B192A] p-6 text-white shadow-sm">
            <h2 className="text-xl font-semibold">Quick actions</h2>
            <div className="mt-5 grid gap-3 text-sm font-medium">
              <Link className="rounded-lg bg-white/10 px-4 py-3 hover:bg-white/20" href="/dashboard/properties#add-property">Add a property</Link>
              <Link className="rounded-lg bg-white/10 px-4 py-3 hover:bg-white/20" href="/dashboard/pipeline">Open the lead pipeline</Link>
              <Link className="rounded-lg bg-white/10 px-4 py-3 hover:bg-white/20" href="/dashboard/reports">View operational reports</Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
