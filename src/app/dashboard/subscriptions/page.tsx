"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";

export default function SubscriptionsPage() {
  return (
    <DashboardShell>
      <section className="max-w-2xl rounded-lg border border-line bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-deep">Plans and billing</h2>
        <p className="mt-3 leading-7 text-quiet">Workspace subscriptions and payments are not yet available. You can review proposed plans or discuss your agency’s requirements with the team.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/pricing" className="brand-button-primary inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold">View proposed plans</Link>
          <Link href="/contact" className="brand-button-secondary inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold">Discuss your requirements</Link>
        </div>
      </section>
    </DashboardShell>
  );
}
