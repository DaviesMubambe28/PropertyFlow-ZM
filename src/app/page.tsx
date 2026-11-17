import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Building2,
  ChevronDown,
  CircleDollarSign,
  ContactRound,
  LayoutDashboard,
  ListChecks,
  ShieldCheck,
  Users,
} from "lucide-react";
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
    question: "Can I process payments or send enquiries?",
    answer: "No. Billing and public enquiry submission are not connected in this prototype. The interface identifies those unavailable flows instead of reporting a false success.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#17212F]">
      <SiteHeader />

      <main>
        <section className="overflow-hidden bg-[#F7F9FC]">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:py-24">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#DCE5EC] bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#142A43] sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-[#087F8C]" />
                Property operations, organised
              </p>
              <h1 className="mt-6 max-w-3xl text-[clamp(2.5rem,5.6vw,4.5rem)] font-semibold leading-[1.06] tracking-[-0.045em] text-[#0B192A]">
                Run Your Real Estate Business From One Powerful Platform.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#526174] sm:text-lg sm:leading-8">
                Organise property records, keep client context close and move leads through a clearer pipeline in one workspace designed for Zambian real estate businesses.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register" className="brand-button-primary inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white">
                  Start Your Workspace
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/features" className="brand-button-secondary inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
                  Explore Features
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-5 max-w-lg text-xs leading-5 text-[#667085]">
                Secure account and agency operations are connected. Public customer enquiries and payments are not connected yet.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[620px]">
              <div aria-hidden="true" className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#DCEFF0] blur-3xl" />
              <div className="relative overflow-hidden rounded-[24px] border border-[#DCE5EC] bg-white shadow-[0_28px_70px_rgba(11,25,42,0.12)]">
                <div className="flex items-center justify-between border-b border-[#E5EAF0] px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#142A43] text-white">
                      <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold text-[#17212F] sm:text-sm">Workspace preview</span>
                  </div>
                  <span className="rounded-full bg-[#F1F5F8] px-2.5 py-1 text-[10px] font-medium text-[#667085] sm:text-xs">
                    Illustrative interface
                  </span>
                </div>
                <div className="grid min-h-[310px] sm:grid-cols-[130px_1fr]">
                  <aside className="hidden border-r border-[#E5EAF0] bg-[#F9FBFC] p-3 sm:block">
                    <p className="px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8A96A5]">Workspace</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 rounded-lg bg-[#EAF2F5] px-2 py-2 text-[11px] font-medium text-[#142A43]">
                        <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" /> Overview
                      </div>
                      <div className="flex items-center gap-2 px-2 py-2 text-[11px] text-[#667085]">
                        <Building2 className="h-3.5 w-3.5" aria-hidden="true" /> Properties
                      </div>
                      <div className="flex items-center gap-2 px-2 py-2 text-[11px] text-[#667085]">
                        <ContactRound className="h-3.5 w-3.5" aria-hidden="true" /> Contacts
                      </div>
                      <div className="flex items-center gap-2 px-2 py-2 text-[11px] text-[#667085]">
                        <ListChecks className="h-3.5 w-3.5" aria-hidden="true" /> Pipeline
                      </div>
                    </div>
                  </aside>
                  <div className="min-w-0 p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#667085]">Workspace overview</p>
                        <h2 className="mt-1 text-lg font-semibold text-[#17212F] sm:text-xl">Your work, in one place</h2>
                      </div>
                      <span className="rounded-lg border border-[#E5EAF0] px-2.5 py-1.5 text-[10px] text-[#667085]">Interface preview</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      {[
                        { label: "Property records", icon: Building2 },
                        { label: "Client contacts", icon: Users },
                        { label: "Lead pipeline", icon: ContactRound },
                        { label: "Operational reports", icon: BarChart3 },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className="flex min-h-[72px] items-center gap-2.5 rounded-xl border border-[#E5EAF0] bg-white p-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF6F7] text-[#087F8C]">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="text-[11px] font-medium leading-4 text-[#526174] sm:text-xs">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] p-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-[#17212F]">Property and lead workflow</p>
                          <p className="mt-1 text-[10px] text-[#667085]">A single view for day-to-day operations</p>
                        </div>
                        <CircleDollarSign className="h-5 w-5 shrink-0 text-[#087F8C]" aria-hidden="true" />
                      </div>
                      <div className="mt-3 flex gap-1.5" aria-hidden="true">
                        <span className="h-1.5 flex-1 rounded-full bg-[#142A43]" />
                        <span className="h-1.5 flex-1 rounded-full bg-[#087F8C]" />
                        <span className="h-1.5 flex-1 rounded-full bg-[#CBD5DE]" />
                        <span className="h-1.5 flex-1 rounded-full bg-[#E5EAF0]" />
                      </div>
                      <p className="mt-2 text-[9px] text-[#8A96A5]">Visual concept only — no fabricated portfolio statistics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B192A] sm:text-4xl">Less admin drift. More clarity on what comes next.</h2>
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
              <p className="mt-4 text-base leading-7 text-[#667085]">Start with the capabilities already represented in the current prototype. Features are clearly marked when they are not yet available.</p>
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
              { title: "Reports", description: "Review summaries calculated from local workspace records.", icon: BarChart3 },
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
