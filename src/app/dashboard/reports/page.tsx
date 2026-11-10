"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";
import { formatCurrency } from "@/lib/tenant";

export default function ReportsPage() {
  const { state, activeOrg } = useAppContext();
  const orgProperties = state.properties.filter((property) => property.orgId === activeOrg?.id);
  const orgLeads = state.leads.filter((lead) => lead.orgId === activeOrg?.id);
  const orgDeals = state.deals.filter((deal) => deal.orgId === activeOrg?.id);
  const total = orgProperties.reduce((sum, property) => sum + property.price, 0);

  const summary = [
    { label: "Total active listings", value: String(orgProperties.length) },
    { label: "Available properties", value: String(orgProperties.filter((property) => property.status === "active").length) },
    { label: "Open deals", value: String(orgDeals.filter((deal) => deal.status === "open").length) },
    { label: "Qualified leads", value: String(orgLeads.filter((lead) => lead.stage === "qualified").length) },
    { label: "Revenue estimate", value: formatCurrency(total) },
  ];

  return (
    <DashboardShell>
      <div className="rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#17212F]">Operational reports</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {summary.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#E5EAF0] bg-[#F7F9FC] p-4">
              <p className="text-sm text-[#667085]">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[#17212F]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
