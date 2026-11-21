"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitDemoRequest } from "@/actions/demo";
import { demoTeamSizes } from "@/lib/validation/demo";

const fields = [
  { name: "name", label: "Full name", autoComplete: "name", type: "text", maxLength: 120, required: true },
  { name: "company", label: "Company name", autoComplete: "organization", type: "text", maxLength: 160, required: true },
  { name: "email", label: "Business email", autoComplete: "email", type: "email", maxLength: 254, required: true },
  { name: "phone", label: "Phone (optional)", autoComplete: "tel", type: "tel", maxLength: 30, required: false },
];
const inputClass = "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900";

export function DemoRequestForm() {
  const [result, action, pending] = useActionState(submitDemoRequest, null);

  if (result === "received") {
    return <p className="rounded-lg bg-teal-50 p-4 text-teal-900" role="status">Your demo request has been received. Our team can use the details you provided to follow up.</p>;
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ label, ...field }) => (
          <label key={field.name} className="text-sm font-medium">{label}
            <input className={inputClass} {...field} />
          </label>
        ))}
      </div>
      <label className="block text-sm font-medium">Team size
        <select className={inputClass} name="teamSize" defaultValue="" required>
          <option value="" disabled>Select team size</option>
          {demoTeamSizes.map((size) => <option key={size}>{size}</option>)}
        </select>
      </label>
      <label className="block text-sm font-medium">What would you like to see? (optional)
        <textarea name="message" className={inputClass} maxLength={2000} rows={4} />
      </label>
      <div hidden><label>Website <input name="website" autoComplete="off" tabIndex={-1} /></label></div>
      {result && <p role="alert" className="text-sm text-red-800">{result}</p>}
      <button disabled={pending} className="brand-button-primary min-h-11 rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Submitting…" : "Send demo request"}
      </button>
      <p className="text-sm text-slate-600">We’ll use your details to respond to your request. <Link className="underline" href="/privacy">Privacy policy</Link></p>
    </form>
  );
}
