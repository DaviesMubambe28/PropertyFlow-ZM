"use client";

import { useActionState } from "react";
import { initialOrganizationState, updateOrganizationProfile } from "@/actions/organizations";
import type { Organization } from "@/lib/types";

const inputClassName = "mt-1.5 w-full rounded-xl border border-line bg-canvas px-3.5 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";

export function AgencySettingsForm({ organization }: { organization: Organization }) {
  const [state, action, pending] = useActionState(updateOrganizationProfile, initialOrganizationState);
  return <form action={action} className="space-y-5">
    <input type="hidden" name="organizationId" value={organization.id} />
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Agency name<input name="name" defaultValue={organization.name} className={inputClassName} required /></label>
      <label className="text-sm font-medium">Agency email<input name="email" type="email" autoComplete="organization email" defaultValue={organization.contactEmail} className={inputClassName} required /></label>
      <label className="text-sm font-medium">Phone<input name="phone" type="tel" autoComplete="organization tel" defaultValue={organization.phone} className={inputClassName} /></label>
      <label className="text-sm font-medium">Location<input name="location" autoComplete="organization address-level2" defaultValue={organization.location} className={inputClassName} /></label>
    </div>
    <label className="block text-sm font-medium">Logo URL <span className="font-normal text-quiet">(HTTPS only)</span><input name="logoUrl" type="url" defaultValue={organization.logoUrl} className={inputClassName} /></label>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Timezone<select name="timezone" defaultValue={organization.timezone} className={inputClassName}><option value="Africa/Lusaka">Africa/Lusaka</option></select></label>
      <label className="text-sm font-medium">Currency<select name="currency" defaultValue={organization.currency} className={inputClassName}><option value="ZMW">ZMW — Zambian Kwacha</option></select></label>
    </div>
    {state.message && <p role={state.status === "error" ? "alert" : "status"} className={`rounded-xl border p-3 text-sm ${state.status === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{state.message}</p>}
    <button disabled={pending} className="brand-button-primary min-h-12 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving…" : "Save agency profile"}</button>
  </form>;
}
