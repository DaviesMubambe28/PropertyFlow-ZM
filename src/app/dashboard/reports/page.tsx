"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";
import { formatCurrency } from "@/lib/tenant";

const lusakaDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Africa/Lusaka",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default function ReportsPage() {
  const { state, activeOrg } = useAppContext();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const invalidRange = Boolean(startDate && endDate && startDate > endDate);

  function inPeriod(value: string | undefined) {
    if (!startDate && !endDate) return true;
    if (!value) return false;
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return false;
    const parts = Object.fromEntries(lusakaDate.formatToParts(date).map(({ type, value }) => [type, value]));
    const day = `${parts.year}-${parts.month}-${parts.day}`;
    return (!startDate || day >= startDate) && (!endDate || day <= endDate);
  }
  const orgProperties = state.properties.filter((property) => property.orgId === activeOrg?.id);
  const orgLeads = state.leads.filter((lead) => lead.orgId === activeOrg?.id && inPeriod(lead.createdAt));
  const orgDeals = state.deals.filter((deal) => deal.orgId === activeOrg?.id && inPeriod(deal.closedAt ?? deal.closingDate));
  const orgViewings = state.viewings.filter((viewing) => viewing.orgId === activeOrg?.id && inPeriod(viewing.date));
  const orgTasks = state.tasks.filter((task) => task.orgId === activeOrg?.id && inPeriod(task.dueDate));
  const total = orgDeals.filter((deal) => deal.status === "completed").reduce((sum, deal) => sum + deal.amount, 0);

  const summary = [
    { label: "Total properties", value: String(orgProperties.length) },
    { label: "Available properties", value: String(orgProperties.filter((property) => property.status === "available").length) },
    { label: "Scheduled viewings", value: String(orgViewings.filter((viewing) => viewing.status === "scheduled").length) },
    { label: "Completed deals", value: String(orgDeals.filter((deal) => deal.status === "completed").length) },
    { label: "Interested leads", value: String(orgLeads.filter((lead) => lead.stage === "interested").length) },
    { label: "Completed deal value", value: formatCurrency(total) },
    { label: "Pending follow-ups", value: String(orgTasks.filter((task) => task.status !== "done").length) },
  ];
  const agentIds = [...new Set([...orgLeads.map((item) => item.assignedTo), ...orgViewings.map((item) => item.agentId), ...orgDeals.map((item) => item.assignedTo), ...orgTasks.map((item) => item.assigneeId)])];

  return (
    <DashboardShell>
      <div className="rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#17212F]">Operational reports</h2>
        <p className="mt-2 text-sm text-slate-600">Dates use Lusaka time. The range filters leads by creation, viewings by appointment, tasks by due date and deals by closing date. Portfolio counts show current availability.</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm font-medium">From
            <input type="date" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} className="rounded-lg border border-slate-300 p-2" />
          </label>
          <label className="grid gap-1 text-sm font-medium">To
            <input type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} className="rounded-lg border border-slate-300 p-2" />
          </label>
          <button type="button" onClick={() => { setStartDate(""); setEndDate(""); }} className="brand-button-secondary rounded-lg px-4 py-2">All time</button>
        </div>
        {invalidRange && <p role="alert" className="mt-2 text-sm text-red-800">Choose an end date on or after the start date.</p>}
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#E5EAF0] bg-[#F7F9FC] p-4">
              <p className="text-sm text-[#667085]">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[#17212F]">{item.value}</p>
            </div>
          ))}
        </div>
        <h3 className="mt-8 text-lg font-semibold text-[#17212F]">Agent performance</h3>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-[#E5EAF0] text-[#667085]"><tr><th className="px-3 py-3 font-medium">Agent</th><th className="px-3 py-3 font-medium">Active leads</th><th className="px-3 py-3 font-medium">Viewings</th><th className="px-3 py-3 font-medium">Completed deals</th><th className="px-3 py-3 font-medium">Open tasks</th></tr></thead><tbody>{agentIds.map((agentId) => <tr key={agentId} className="border-b border-[#EEF2F5]"><td className="px-3 py-3 font-medium">{state.users.find((user) => user.id === agentId)?.fullName ?? `Agent ${agentId.slice(0, 8)}`}</td><td className="px-3 py-3">{orgLeads.filter((item) => item.assignedTo === agentId && !["converted", "lost"].includes(item.stage)).length}</td><td className="px-3 py-3">{orgViewings.filter((item) => item.agentId === agentId).length}</td><td className="px-3 py-3">{orgDeals.filter((item) => item.assignedTo === agentId && item.status === "completed").length}</td><td className="px-3 py-3">{orgTasks.filter((item) => item.assigneeId === agentId && item.status !== "done").length}</td></tr>)}{agentIds.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-[#667085]">No agent activity has been recorded yet.</td></tr>}</tbody></table></div>
      </div>
    </DashboardShell>
  );
}
