"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { AgencySettingsForm } from "@/components/agency-settings-form";
import { useAppContext } from "@/components/app-provider";

export default function AgencySettingsPage() {
  const { activeOrg, currentUser } = useAppContext();
  return <DashboardShell>
    <section className="mx-auto max-w-3xl rounded-[28px] border border-[#E5EAF0] bg-white p-5 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Agency administration</p>
      <h2 className="mt-2 text-2xl font-semibold text-[#17212F]">Agency profile</h2>
      <p className="mt-2 text-sm leading-6 text-[#667085]">Keep the details shown to your team accurate. Changes are restricted to administrators.</p>
      <div className="mt-7">
        {activeOrg && currentUser?.role === "owner" ? <AgencySettingsForm organization={activeOrg} /> : <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">You have read-only agency access.</p>}
      </div>
    </section>
  </DashboardShell>;
}
