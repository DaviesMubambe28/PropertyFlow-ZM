import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CalendarCheck2, ChartNoAxesColumnIncreasing, ShieldCheck, Users } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { EvaluationPricing } from "@/components/evaluation-pricing";
import { ProductTour } from "@/components/product-tour";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const workflows = [
  { icon: Building2, title: "Keep your portfolio current", body: "See which properties are on the market, under offer, sold or rented. Give your team a shared property record to work from." },
  { icon: CalendarCheck2, title: "Follow up while interest is fresh", body: "Assign enquiries, book viewings and keep notes beside the lead so the next action is clear." },
  { icon: ChartNoAxesColumnIncreasing, title: "Track outcomes across the agency", body: "Review active leads, pending work and completed transactions using the records your agents already maintain." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#122438]">
      <SiteHeader />
      <main>
        <div className="bg-[#071B30] text-white">
          <section className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-12 sm:px-9 sm:py-16 xl:grid-cols-[.82fr_1.18fr] xl:gap-12 xl:px-12 xl:py-24">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.17em] text-[#9cd8d4]"><span className="h-px w-6 bg-current" /> For Zambian real estate agencies</p>
              <h1 className="mt-5 max-w-[13ch] text-[clamp(2.75rem,5vw,5.35rem)] font-semibold leading-[1.02] tracking-[-.065em]">Run your agency from one workspace.</h1>
              <p className="mt-5 max-w-md text-base leading-7 text-[#c8d8e6] sm:text-lg">Manage listings, assign enquiries, schedule viewings and track deals from first contact to close.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#a1ded6] px-5 py-3 text-sm font-semibold text-[#071B30] hover:bg-white">Request a demo <ArrowRight size={16} aria-hidden="true" /></Link>
                <Link href="#product-tour" className="inline-flex min-h-11 items-center rounded-lg border border-[#567085] px-5 py-3 text-sm font-semibold hover:bg-white/10">Explore the platform</Link>
              </div>
            </div>
            <ProductTour />
          </section>
        </div>
        <section id="solutions" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <h2 className="max-w-[19ch] text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-5xl">From a new listing to a completed deal.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {workflows.map(({ icon: Icon, title, body }) => (
              <article key={title} className="border-t-2 border-[#cee0e5] pt-5">
                <Icon className="mb-4 text-teal-800" size={24} aria-hidden="true" />
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#526579]">{body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="bg-[#edf5f5]">
          <div className="mx-auto grid max-w-7xl gap-7 px-5 py-12 sm:px-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Give owners and agents a shared view of the work.</h2>
              <Link href="/enterprise" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-teal-900">Explore enterprise workflows <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
            <div className="space-y-4 text-sm leading-6 text-[#364c60]">
              <p className="flex gap-3"><Users className="mt-1 shrink-0 text-teal-800" size={18} aria-hidden="true" /> Invite agents, assign work and keep viewing feedback attached to the client record.</p>
              <p className="flex gap-3"><ShieldCheck className="mt-1 shrink-0 text-teal-800" size={18} aria-hidden="true" /> Active membership and role controls govern access to each private workspace.</p>
            </div>
          </div>
        </section>
        <section className="border-b border-slate-200 bg-[#f4f7fa]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <h2 className="mb-4 text-3xl font-semibold tracking-tight">Workspace plans</h2>
            <EvaluationPricing />
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Questions about getting started</h2>
          <div className="mt-5 max-w-3xl divide-y divide-slate-200 border-y border-slate-200">
            <details className="py-4"><summary className="cursor-pointer font-semibold">Can independent agents use it?</summary><p className="mt-2 text-sm leading-6 text-slate-600">Yes. You can use a workspace to manage your own properties, contacts, viewings and deals.</p></details>
            <details className="py-4"><summary className="cursor-pointer font-semibold">How can I evaluate it with my team?</summary><p className="mt-2 text-sm leading-6 text-slate-600">Request an enterprise demo to discuss your workflows and review the <Link href="/pricing" className="font-semibold text-teal-800 underline">indicative plans</Link>.</p></details>
          </div>
        </section>
        <section className="bg-[#102D49] text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-10 sm:px-8">
            <h2 className="text-2xl font-semibold tracking-tight">See PropertyFlow ZM with your team.</h2>
            <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#a1ded6] px-5 font-semibold text-[#071B30] hover:bg-white">Request a demo <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
