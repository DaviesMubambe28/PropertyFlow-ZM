"use client";

import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { OperationsManager } from "@/components/operations-manager";

export default function ActivitiesPage() {
  return <DashboardShell><div className="space-y-5"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">Agency operations</p><h2 className="mt-2 text-2xl font-semibold">Activities and deals</h2><p className="mt-2 text-sm text-muted-ink">Coordinate viewings, follow-up tasks, and deal progress in the shared workspace.</p></div><Suspense fallback={<p role="status">Loading activities…</p>}><OperationsManager /></Suspense></div></DashboardShell>;
}
