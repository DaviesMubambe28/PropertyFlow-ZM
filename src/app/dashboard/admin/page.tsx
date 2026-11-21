"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";

export default function AdminPage() {
  const { state, currentUser } = useAppContext();

  return (
    <DashboardShell>
      {currentUser?.role === "super_admin" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">Organisations</h2>
            <div className="mt-6 space-y-3">
              {state.organizations.map((organization) => (
                <div key={organization.id} className="rounded-2xl border border-line p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-ink">{organization.name}</p>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{organization.subscriptionStatus}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-ink">{organization.type} • {organization.contactEmail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">Platform controls</h2>
            <div className="mt-6 space-y-3 text-sm text-muted-ink">
              <div className="rounded-2xl bg-canvas p-4">View subscription states and plan assignments.</div>
              <div className="rounded-2xl bg-canvas p-4">Review usage across workspaces.</div>
              <div className="rounded-2xl bg-canvas p-4">Audit operational health and access events.</div>
            </div>
          </div>
        </div>
      ) : (
        <div role="status" className="rounded-2xl border border-line bg-white p-6 text-sm text-muted-ink">
          Platform administration is not available for this account.
        </div>
      )}
    </DashboardShell>
  );
}
