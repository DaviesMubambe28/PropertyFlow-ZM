"use client";

import { useActionState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { submitDemoRequest } from "@/actions/demo";
import { teamSizes } from "@/lib/validation/demo";

const inputClass = "min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] text-ink";

const fields = [
  { label: "Full name", name: "fullName", type: "text", autoComplete: "name", maxLength: 100, required: true },
  { label: "Company", name: "company", type: "text", autoComplete: "organization", maxLength: 150, required: true },
  { label: "Business email", name: "email", type: "email", autoComplete: "email", maxLength: 254, required: true },
  { label: "Phone (optional)", name: "phone", type: "tel", autoComplete: "tel", maxLength: 32, required: false },
];

export function DemoRequestForm() {
  const [state, action, pending] = useActionState(submitDemoRequest, { status: "idle" as const, message: "" });
  if (state.status === "success") {
    return <div role="status" className="rounded-2xl border border-teal-200 bg-soft p-7 text-teal-950">
      <CheckCircle2 aria-hidden="true" className="mb-3" />
      <h2 className="text-xl font-semibold">Demo request received</h2>
      <p className="mt-2 leading-6">{state.message}</p>
    </div>;
  }

  return (
    <form action={action} className="grid gap-5 rounded-2xl border border-line bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-8">
      {fields.map(({ label, ...input }) => (
        <label key={input.name} className="grid gap-1.5 text-sm font-semibold">
          {label}<input {...input} className={inputClass} />
        </label>
      ))}
      <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">Team size
        <select name="teamSize" required defaultValue="" className={inputClass}>
          <option value="" disabled>Select team size</option>
          {teamSizes.map((size) => <option key={size}>{size}</option>)}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">What would you like to cover? (optional)
        <textarea name="requirements" rows={4} maxLength={1500} className={inputClass} />
      </label>
      <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="text-sm leading-6 text-muted-ink sm:col-span-2">We use these details to review and follow up on your demo request. Please keep client records out of this form.</p>
      {state.status === "error" && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">{state.message}</p>}
      <button disabled={pending} className="brand-button-primary inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-60 sm:col-span-2">
        {pending ? "Saving request…" : "Request a demo"} <ArrowRight size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
