"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { OperationsManager } from "@/components/operations-manager";

export default function ActivitiesPage() {
  return <DashboardShell><div className="space-y-5"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Agency operations</p><h2 className="mt-2 text-2xl font-semibold">Activities and deals</h2><p className="mt-2 text-sm text-[#667085]">Coordinate viewings, follow-up tasks, and deal progress in the shared workspace.</p></div><OperationsManager /></div></DashboardShell>;
}
