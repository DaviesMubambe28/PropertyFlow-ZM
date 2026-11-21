import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, BarChart3, Building2, CalendarDays, ChevronDown, ContactRound, FolderKanban, Search, UsersRound } from "lucide-react";
import { ProductTour } from "@/components/product-tour";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const workflows = [
  { title: "Properties", text: "Keep prices, availability and listing details together.", icon: Building2 },
  { title: "Contacts", text: "Keep client preferences and conversations close.", icon: ContactRound },
  { title: "Pipeline", text: "See which enquiries need a follow-up or a viewing.", icon: FolderKanban },
  { title: "Reporting", text: "Review listings, activity and deals as a team.", icon: BarChart3 },
];

const audiences = [
  { title: "Independent agents", text: "Organise your listings, client notes and next steps.", icon: Search },
  { title: "Real estate agencies", text: "Coordinate enquiries, viewings and deals in one shared workspace.", icon: UsersRound },
  { title: "Property managers", text: "Keep availability and rental enquiries organised.", icon: Building2 },
];

const faqs = [
  { question: "How do I get started?", answer: "Create a workspace and verify your email. Then add your first property or invite your team." },
  { question: "Can I invite agents to my workspace?", answer: "Yes. Agency owners can invite agents from the workspace team settings." },
  { question: "What happens when I request a demo?", answer: "Send your company details and the workflows you’d like to see. The team can then follow up with you." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <section className="site-width py-19 text-center sm:py-26">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand sm:text-base">Real estate software for Zambia</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-[clamp(1.85rem,7.1vw,6rem)] font-black uppercase leading-[0.98] tracking-[-0.05em] text-brand">
            Property work.<br />One workspace.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-ink">
            Manage listings, follow up with clients, and track every viewing and deal with your team.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="brand-button-secondary inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
              Create a workspace <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a href="#product-tour" className="brand-button-secondary inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
              Explore the product <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="site-band">
          <div className="site-width grid items-center gap-8 pb-12 pt-10 md:grid-cols-[1.04fr_0.96fr] md:gap-12 md:py-0">
            <div className="md:py-13">
              <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Stay on top of every property.</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">Give your team one place to see what’s available, who’s interested and what needs to happen next.</p>
              <ul className="mt-6 flex flex-wrap gap-5">
                {[{ label: "Listings", icon: Building2 }, { label: "Viewings", icon: CalendarDays }, { label: "Deals", icon: FolderKanban }].map(({ label, icon: Icon }) => (
                  <li key={label} className="grid justify-items-center gap-2 text-xs font-semibold">
                    <span className="grid size-12 place-items-center rounded-full bg-white text-brand"><Icon size={20} aria-hidden="true" /></span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="relative aspect-[4/3] overflow-hidden border-4 border-white bg-tint md:mt-8 md:-mb-12 md:aspect-[6/5]">
              <Image src="/marketing/property-exterior.jpg" alt="Contemporary white home with a landscaped courtyard" fill sizes="(max-width: 767px) 90vw, 460px" className="object-cover" />
            </figure>
          </div>
        </section>

        <section className="site-width pb-14 pt-12 md:pt-21">
          <h2 className="text-3xl font-bold tracking-tight text-brand">Everything your team needs to follow through.</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-ink">Connect the property record to the people, appointments and decisions around it.</p>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-6">
            {workflows.map(({ title, text, icon: Icon }) => (
              <article key={title}>
                <div className="grid h-23 place-items-center border border-line bg-tint text-brand"><Icon size={38} strokeWidth={1.45} aria-hidden="true" /></div>
                <h3 className="mt-3 font-bold text-brand">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-ink">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="product-tour" className="site-width scroll-mt-6 pb-15">
          <div className="mx-auto mb-7 max-w-lg text-center">
            <h2 className="text-3xl font-bold tracking-tight text-brand">See the workspace in action.</h2>
            <p className="mt-3 text-sm leading-6 text-ink">Explore a sample agency, from the first enquiry to reporting on its deals.</p>
          </div>
          <ProductTour />
        </section>

        <section id="solutions" className="site-width scroll-mt-6 border-t border-line pb-14 pt-11">
          <h2 className="text-3xl font-bold tracking-tight text-brand">Built for the way you work.</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            {audiences.map(({ title, text, icon: Icon }) => (
              <article key={title} className="border border-line p-5">
                <Icon size={26} className="text-brand" aria-hidden="true" />
                <h3 className="mt-4 font-bold text-brand">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="site-band text-center">
          <div className="site-width py-12">
            <h2 className="text-3xl font-bold tracking-tight">See what it could do for your agency.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-blue-100">Tell us how you work and what you want to cover in a walkthrough.</p>
            <Link href="/contact" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-brand hover:bg-tint">
              Request a demo <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="site-width grid gap-7 py-13 md:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-3xl font-bold tracking-tight text-brand">Common questions</h2>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map(({ question, answer }) => (
              <details key={question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-brand">
                  {question}<ChevronDown size={16} className="shrink-0 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pb-4 text-sm leading-6 text-ink">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
