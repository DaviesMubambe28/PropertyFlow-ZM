import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Enterprise real estate operations | PropertyFlow ZM",
  description: "Explore PropertyFlow ZM for established Zambian real estate agencies and discuss your team’s requirements.",
};

const capabilities = [
  { title: "One agency portfolio", text: "Store listing details, availability and property assignments in your agency workspace.", icon: Building2 },
  { title: "Team access", text: "Invite agents to your workspace and keep agency records separate from other organisations.", icon: ShieldCheck },
  { title: "Operational reporting", text: "Review property, lead, viewing and deal activity from the records your team maintains.", icon: ChartNoAxesCombined },
];

export default function EnterprisePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-[#102940] text-white">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <p className="font-semibold text-teal-200">For established agencies</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Coordinate your real estate operations as your team grows.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">Give agents a shared place to work and agency leaders visibility into listings, follow-ups and transactions.</p>
            <Link href="/contact" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#142A43]">
              Discuss your requirements <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-5 px-5 py-14 sm:px-8 md:grid-cols-3" aria-label="Agency capabilities">
          {capabilities.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-xl border border-slate-200 bg-white p-6">
              <Icon className="text-teal-800" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
