import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ChartNoAxesCombined, ListChecks, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Enterprise real estate operations | PropertyFlow ZM",
  description: "Explore PropertyFlow ZM for established Zambian real estate agencies and discuss your team’s requirements.",
};

const capabilities = [
  { title: "One agency portfolio", text: "Store listing details, availability and property assignments in your agency workspace.", icon: Building2 },
  { title: "Team access", text: "Invite agents to your workspace and keep agency records separate from other organisations.", icon: ShieldCheck },
  { title: "Listing publication", text: "Agency administrators review and publish individual listings. Public pages show the property details approved for publication.", icon: ListChecks },
  { title: "Branch portfolios", text: "Assign properties to branches and give agency administrators a view across the portfolio.", icon: Building2 },
  { title: "Operational reporting", text: "Review property, lead, viewing and deal activity from the records your team maintains.", icon: ChartNoAxesCombined },
];

export default function EnterprisePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-intro">
          <div className="site-width py-14 sm:py-20">
            <p className="font-semibold text-brand">For established agencies</p>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Coordinate your real estate operations as your team grows.</h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-quiet">Give agents a shared place to work and agency leaders visibility into listings, follow-ups and transactions.</p>
            <Link href="/contact" className="mt-8 inline-flex min-h-11 items-center gap-2 brand-button-secondary rounded-full px-5 py-3 text-sm font-semibold">
              Discuss your requirements <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
        <section className="site-width grid gap-5 py-14 sm:grid-cols-2" aria-label="Agency capabilities">
          {capabilities.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-xl border border-line bg-white p-6">
              <Icon className="text-brand" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </section>
        <section className="border-y border-line bg-canvas">
          <div className="site-width grid gap-7 py-12 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-brand">Evaluate it with your team</h2>
              <p className="mt-3 leading-7 text-quiet">Start with a walkthrough of the work your agency does each day.</p>
              <Link href="/#product-tour" className="mt-5 inline-flex items-center gap-2 font-semibold text-brand underline">Explore the sample workspace <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <ol className="divide-y divide-line border-y border-line">
              <li className="py-4"><strong>Set up the agency.</strong> Verify the administrator account and invite the people who will use the workspace.</li>
              <li className="py-4"><strong>Follow one enquiry.</strong> Connect a property, contact and viewing, then review the progress in the pipeline.</li>
              <li className="py-4"><strong>Review operational needs.</strong> Ask about branch structure, existing spreadsheets and how your team reports on transactions.</li>
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
