"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { useAppContext } from "@/components/app-provider";

export default function SubscriptionsPage() {
  const { state, activeOrg } = useAppContext();
  const currentPlan = state.subscriptionPlans.find((plan) => plan.id === activeOrg?.subscriptionPlanId);

  return (
    <DashboardShell>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Subscriptions</h2>
        <p className="mt-2 text-sm text-slate-600">Plan examples are stored locally. Subscription changes and payments are not connected.</p>
        {currentPlan && (
          <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">Workspace plan example</p>
            <p className="mt-1 font-semibold text-slate-900">{currentPlan.name} <span className="font-normal text-slate-600">· {activeOrg?.subscriptionStatus}</span></p>
          </div>
        )}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {state.subscriptionPlans.map((plan) => (
            <div key={plan.id} className={`rounded-2xl border p-5 ${plan.enabled ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-slate-100 opacity-60"}`}>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{plan.name}</p>
              <p className="mt-4 text-3xl font-semibold tabular-nums text-slate-900">K{plan.price.toLocaleString("en-ZM")}</p>
              <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
              <div className="mt-4 text-sm text-slate-600">
                <p>{plan.seats} seats</p>
                <p>{plan.listings} listings</p>
              </div>
              <p className={`mt-6 rounded-full px-4 py-2 text-center text-sm font-medium ${plan.enabled ? "bg-white text-slate-700" : "bg-white text-slate-500"}`}>
                {plan.enabled ? "Example plan" : "Not available"}
              </p>
            </div>
          ))}
        </div>
        {state.subscriptionPlans.length === 0 && (
          <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">No subscription plan data is available in this workspace.</p>
        )}
      </div>
    </DashboardShell>
  );
}
