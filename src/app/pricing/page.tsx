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
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main className="site-width py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-quiet">Proposed plans</p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-brand sm:text-5xl">A workspace for every stage of agency growth</h1>
          <p className="mt-4 text-sm leading-6 text-quiet">
            Prices are indicative. You can create a workspace or discuss your requirements with our team.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-lg border p-8 shadow-sm ${plan.highlight ? "border-brand bg-brand text-white" : "border-line bg-white text-ink"}`}>
              <p className={`text-sm font-medium uppercase tracking-[0.2em] ${plan.highlight ? "text-blue-100" : "text-quiet"}`}>
                {plan.name}
              </p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-semibold tabular-nums">{plan.price === null ? "Contact us" : `K${plan.price.toLocaleString("en-ZM")}`}</span>
                {plan.price !== null && <span className={`text-sm ${plan.highlight ? "text-blue-100" : "text-quiet"}`}>
                  / month
                </span>}
              </div>
              <p className={`mt-4 text-sm ${plan.highlight ? "text-blue-100" : "text-quiet"}`}>{plan.description}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.highlight ? "bg-white text-deep" : "bg-tint text-brand"}`}>
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className={`mt-8 inline-flex rounded-full px-5 py-3 font-medium ${plan.highlight ? "bg-white text-ink" : "bg-brand text-white"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <section className="mt-12 rounded-lg border border-line bg-white p-6 sm:p-8" aria-labelledby="plan-details">
          <h2 id="plan-details" className="text-2xl font-bold text-deep">What to compare before choosing a plan</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Users, properties and branches</dt>
              <dd className="mt-1 text-sm leading-6 text-quiet">Tell us how many people and branches use your portfolio. We’ll confirm capacity when discussing your workspace.</dd>
            </div>
            <div>
              <dt className="font-semibold">Billing, support and upgrades</dt>
              <dd className="mt-1 text-sm leading-6 text-quiet">The monthly prices are proposed. Billing, support arrangements and upgrade terms will be confirmed before a subscription starts.</dd>
            </div>
          </dl>
          <Link href="/contact" className="mt-6 inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold brand-button-secondary">Request an enterprise quotation</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
