import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ChevronDown,
  ContactRound,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import { ProductTour } from "@/components/product-tour";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const solutions = [
  {
    title: "Real estate agencies",
    description: "Give your team one shared place for property records, client follow-ups and lead stages.",
    icon: Building2,
  },
  {
    title: "Independent agents",
    description: "Keep your working portfolio and sales activity organised without managing a large team.",
    icon: ContactRound,
  },
  {
    title: "Landlords & managers",
    description: "Create a workspace for property operations. Dedicated tenancy and rent workflows are still in development.",
    icon: ShieldCheck,
    note: "Rental operations in development",
  },
];

const steps = [
  { number: "01", title: "Set up your workspace", description: "Choose the kind of property business you run and add your account details." },
  { number: "02", title: "Organise your records", description: "Create property and contact records, then keep the information together in one workspace." },
  { number: "03", title: "Move work forward", description: "Track leads through the pipeline and keep an eye on your operational overview." },
];

const faqs = [
  {
    question: "Is PropertyFlow ZM connected to a live database?",
    answer: "Yes. Account, agency, property, CRM, viewing, task, and deal records use a shared tenant-isolated Supabase service. Billing remains a separate launch dependency.",
  },
  {
    question: "Are the properties shown real listings?",
    answer: "No. Any listings currently shown are development examples for interface demonstration only. They are not verified offers for sale or rent.",
  },
  {
    question: "Can I request a walkthrough for my agency?",
    answer: "Yes. You can submit a demo request with your company details and the workflows you would like to see.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#17212F]">
      <SiteHeader />

      <main>
        <section className="bg-[#102940] text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-24">
            <div>
              <p className="text-sm font-semibold text-teal-200">Real estate software for Zambia</p>
              <h1 className="mt-5 text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
                Run your agency from one workspace.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-200">
                Manage property listings, follow up with clients and track every viewing and deal with your team.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#142A43] hover:bg-teal-50">
                  Request a demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/register" className="inline-flex min-h-11 items-center rounded-lg border border-slate-400 px-5 py-3 text-sm font-semibold hover:bg-white/10">
                  Create a workspace
                </Link>
              </div>
            </div>
            <ProductTour />
          </div>
        </section>

        <section id="solutions" className="scroll-mt-24 border-b border-[#E5EAF0] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Solutions</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B192A] sm:text-4xl">Built around the way property work gets done.</h2>
              <p className="mt-4 text-base leading-7 text-[#667085]">Useful workflows for the people managing property, clients and the next step in a deal.</p>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {solutions.map((solution) => {
                const Icon = solution.icon;
                return (
                  <article key={solution.title} className="rounded-2xl border border-[#E5EAF0] bg-[#F9FBFC] p-5 sm:p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142A43] text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-[#17212F]">{solution.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#667085]">{solution.description}</p>
                    {"note" in solution && solution.note && (
                      <p className="mt-4 inline-flex rounded-full border border-[#E5EAF0] bg-white px-2.5 py-1 text-xs font-medium text-[#667085]">{solution.note}</p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#F7F9FC]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B192A] sm:text-4xl">Keep listings, enquiries and follow-ups together.</h2>
              <p className="mt-4 text-base leading-7 text-[#667085]">Keep the important details and next actions connected, from first record to an active pipeline.</p>
              <Link href="/features" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#087F8C] hover:text-[#066875]">
                See what’s available <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ol className="divide-y divide-[#E1E7EC] border-y border-[#E1E7EC]">
              {steps.map((step) => (
                <li key={step.number} className="grid gap-3 py-5 sm:grid-cols-[56px_1fr] sm:gap-5">
                  <span className="text-sm font-semibold tabular-nums text-[#087F8C]">{step.number}</span>
                  <div>
                    <h3 className="font-semibold text-[#17212F]">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-[#667085]">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Platform overview</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B192A] sm:text-4xl">A connected view of your operations.</h2>
              <p className="mt-4 text-base leading-7 text-[#667085]">Connect property records, client details and deal progress in a shared agency workspace.</p>
            </div>
            <Link href="/features" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#087F8C] hover:text-[#066875]">
              Explore platform <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Property records", description: "Add and review your workspace’s property details.", icon: Building2 },
              { title: "Contacts", description: "Keep client details and notes together.", icon: ContactRound },
              { title: "Lead pipeline", description: "Move lead records through defined sales stages.", icon: ListChecks },
              { title: "Reports", description: "Review summaries calculated from agency workspace records.", icon: BarChart3 },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-2xl border border-[#E5EAF0] bg-white p-5">
                  <Icon className="h-5 w-5 text-[#087F8C]" aria-hidden="true" />
                  <h3 className="mt-4 font-semibold text-[#17212F]">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-[#E5EAF0] bg-[#F7F9FC]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Plans</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0B192A] sm:text-3xl">Find the right workspace for your business.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">The displayed plan details are prototype examples. Subscription changes and payments are not connected.</p>
            </div>
            <Link href="/pricing" className="brand-button-secondary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
              View plan examples <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Frequently asked</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B192A] sm:text-4xl">A few things to know before you start.</h2>
          </div>
          <div className="mt-7 divide-y divide-[#E5EAF0] border-y border-[#E5EAF0]">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-sm font-semibold text-[#17212F] marker:hidden sm:text-base">
                  {faq.question}
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#667085] transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="max-w-3xl pt-3 text-sm leading-6 text-[#667085]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-6 lg:pb-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[24px] bg-[#0B192A] px-6 py-8 text-white sm:px-9 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A7DADC]">Ready to explore?</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Bring your property workflow into focus.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Try the local prototype and see how a more organised workspace could work for your team.</p>
            </div>
            <Link href="/register" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0B192A] hover:bg-[#F1F5F8]">
              Start Your Workspace <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
