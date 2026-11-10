import Link from "next/link";
import { Check } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const plans = [
  {
    name: "Agent Solo",
    price: 249,
    description: "Perfect for independent agents and smaller communities.",
    features: ["One workspace example", "Property records", "Contacts and notes", "Lead pipeline"],
    highlight: false,
  },
  {
    name: "Agency Team",
    price: 799,
    description: "For agencies managing multiple property campaigns and staff.",
    features: ["Property records", "Contacts and notes", "Lead pipeline", "Local record summaries"],
    highlight: true,
  },
  {
    name: "Agency Business",
    price: 1499,
    description: "Scale with deeper controls, more seats, and listing volume.",
    features: ["Property records", "Contacts and notes", "Lead pipeline", "Local record summaries"],
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#17212F]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#667085]">Plan examples</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#0B192A]">A starting point for workspace plans</h1>
          <p className="mt-4 text-sm leading-6 text-[#667085]">
            These values come from the prototype’s local seed data. No subscription is created and billing is not connected.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-[30px] border p-8 shadow-sm ${plan.highlight ? "border-[#142A43] bg-[#0B192A] text-white shadow-[0_20px_50px_rgba(11,25,42,0.15)]" : "border-[#E5EAF0] bg-white text-[#17212F]"}`}>
              <p className={`text-sm font-medium uppercase tracking-[0.2em] ${plan.highlight ? "text-slate-300" : "text-[#667085]"}`}>
                {plan.name}
              </p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-semibold tabular-nums">K{plan.price.toLocaleString("en-ZM")}</span>
                <span className={`text-sm ${plan.highlight ? "text-slate-300" : "text-[#667085]"}`}>
                  / month
                </span>
              </div>
              <p className={`mt-4 text-sm ${plan.highlight ? "text-slate-300" : "text-[#667085]"}`}>{plan.description}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.highlight ? "bg-white text-[#0B192A]" : "bg-[#EAF6F7] text-[#087F8C]"}`}>
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className={`mt-8 inline-flex rounded-full px-5 py-3 font-medium ${plan.highlight ? "bg-white text-[#17212F]" : "bg-[#142A43] text-white"}`}>
                Try the prototype
              </Link>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-[#667085]">
          The landlord plan and billing are not active features. The displayed plan names, capacity limits and prices are illustrative configuration from the development prototype, not an offer to purchase.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
