"use client";

import { BarChart3, Building2, ContactRound, FolderKanban } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";
import { formatCurrency } from "@/lib/tenant";
import { getPlanById } from "@/lib/store";

export default function DashboardOverviewPage() {
  const { state, activeOrg } = useAppContext();
  const orgProperties = state.properties.filter((property) => property.orgId === activeOrg?.id && property.status === "available");
  const activeLeads = state.leads.filter((lead) => lead.orgId === activeOrg?.id && !["converted", "lost"].includes(lead.stage));
  const openDeals = state.deals.filter((deal) => deal.orgId === activeOrg?.id && deal.status === "open");
  const openDealValue = openDeals.reduce((total, deal) => total + deal.amount, 0);
  const activePlan = activeOrg ? getPlanById(state.subscriptionPlans, activeOrg.subscriptionPlanId) : null;

  const cards = [
    { label: "Active listings", value: String(orgProperties.length), icon: Building2 },
    { label: "Active leads", value: String(activeLeads.length), icon: ContactRound },
    { label: "Open deals", value: String(openDeals.length), icon: FolderKanban },
    { label: "Open deal value", value: formatCurrency(openDealValue), icon: BarChart3 },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-[28px] border border-[#E5EAF0] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#667085]">{card.label}</p>
                  <span className="rounded-xl bg-[#EAF6F7] p-2"><Icon className="h-4 w-4 text-[#087F8C]" /></span>
                </div>
                <p className="mt-5 text-3xl font-semibold text-[#17212F]">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#17212F]">Latest activity</h2>
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
            <h2 className="text-xl font-semibold">Subscription</h2>
            <div className="mt-6 space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Plan example</p>
              <p className="text-2xl font-semibold">{activePlan?.name ?? "No plan data"}</p>
              <p className="text-slate-300">
                {activePlan ? `${activePlan.seats} seats • ${activePlan.listings} listings` : "Plan limits are not configured"}
              </p>
              <p className="text-xs text-slate-400">Subscription and billing are not connected in this prototype.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
