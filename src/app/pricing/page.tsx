import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Workspace plans | PropertyFlow ZM",
  description: "Explore proposed workspace plans for Zambian independent agents and agencies.",
};

const plans = [
  {
    name: "Starter",
    price: 150,
    description: "For independent agents organising listings and follow-ups.",
    features: ["Property records", "Contacts and notes", "Lead pipeline"],
    href: "/register",
    cta: "Create a workspace",
    highlight: false,
  },
  {
    name: "Business",
    price: 350,
    description: "For growing agencies coordinating shared property and client records.",
    features: ["Team invitations", "Viewings and follow-ups", "Operational reporting"],
    href: "/contact",
    cta: "Request a demo",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: null,
    description: "For established agencies evaluating the needs of a larger team.",
    features: ["Agency workspace", "Team access", "Deal and activity reporting"],
    href: "/enterprise",
    cta: "Explore enterprise",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#17212F]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#667085]">Proposed plans</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#0B192A]">A workspace for every stage of agency growth</h1>
          <p className="mt-4 text-sm leading-6 text-[#667085]">
            Prices are indicative. You can create a workspace or discuss your requirements with our team.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-[30px] border p-8 shadow-sm ${plan.highlight ? "border-[#142A43] bg-[#0B192A] text-white shadow-[0_20px_50px_rgba(11,25,42,0.15)]" : "border-[#E5EAF0] bg-white text-[#17212F]"}`}>
              <p className={`text-sm font-medium uppercase tracking-[0.2em] ${plan.highlight ? "text-slate-300" : "text-[#667085]"}`}>
                {plan.name}
              </p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-semibold tabular-nums">{plan.price === null ? "Contact us" : `K${plan.price.toLocaleString("en-ZM")}`}</span>
                {plan.price !== null && <span className={`text-sm ${plan.highlight ? "text-slate-300" : "text-[#667085]"}`}>
                  / month
                </span>}
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

              <Link href={plan.href} className={`mt-8 inline-flex rounded-full px-5 py-3 font-medium ${plan.highlight ? "bg-white text-[#17212F]" : "bg-[#142A43] text-white"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
