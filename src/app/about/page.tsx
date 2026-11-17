import Link from "next/link";
import { ArrowRight, Building2, CircleCheck, Compass, MapPinned, Users } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const principles = [
  { title: "Clarity before complexity", description: "Make the status of a property, contact or lead easy to understand at a glance.", icon: Compass },
  { title: "Workflows grounded in reality", description: "Build around the practical work agents and property managers do every day.", icon: CircleCheck },
  { title: "Designed for local context", description: "Respect local currency and time conventions without assuming every business works the same way.", icon: MapPinned },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#17212F]">
      <SiteHeader />
      <main>
        <section className="bg-[#F7F9FC]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">About PropertyFlow ZM</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[#0B192A] sm:text-5xl">
              Property work should feel connected, not scattered.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
              PropertyFlow ZM is being shaped as a practical workspace for real estate agencies, independent agents and property managers in Zambia. Its purpose is to bring property records, client context and sales follow-up into a clearer working flow.
            </p>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-[#526174]">
              Account, agency, property, CRM, viewing, task, and deal workflows now use a secure shared service with tenant-isolated access.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-18">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">The purpose</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0B192A] sm:text-3xl">Bring the moving parts of property work into view.</h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-[#667085] sm:text-base">
            <p>Property operations can span listing details, enquiries, follow-up, viewings, negotiations and internal hand-offs. When that context lives in separate places, it is easy to lose track of what needs attention.</p>
            <p>The prototype explores a shared workspace model: organise core records, understand where leads stand, and keep the next action easier to find.</p>
          </div>
        </section>

        <section className="border-y border-[#E5EAF0] bg-[#F7F9FC]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Who it serves</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0B192A] sm:text-3xl">Different property businesses. A clearer daily view.</h2>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                { title: "Agencies", text: "Coordinate property and client records across a shared team workspace." },
                { title: "Independent agents", text: "Keep an individual portfolio and client pipeline organised in one place." },
                { title: "Landlords and managers", text: "Explore a property workspace while dedicated tenancy and rent tools are still in development." },
              ].map((item) => (
                <article key={item.title} className="rounded-2xl border border-[#E5EAF0] bg-white p-5 sm:p-6">
                  <Users className="h-5 w-5 text-[#087F8C]" aria-hidden="true" />
                  <h3 className="mt-4 font-semibold text-[#17212F]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Product principles</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0B192A] sm:text-3xl">Useful first. Honest about what is ready.</h2>
            </div>
            <div className="divide-y divide-[#E5EAF0] border-y border-[#E5EAF0]">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <article key={principle.title} className="flex gap-4 py-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF6F7] text-[#087F8C]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#17212F]">{principle.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-[#667085]">{principle.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="mt-10 flex items-start gap-3 rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] p-4 text-sm leading-6 text-[#526174]">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-[#087F8C]" aria-hidden="true" />
            <p>Local context in this prototype includes ZMW currency formatting and the Africa/Lusaka timezone. It does not represent a verified business address, office or operating company.</p>
          </div>
        </section>

        <section className="px-5 pb-14 sm:px-6 lg:pb-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[24px] bg-[#0B192A] p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A7DADC]">Explore the prototype</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">See the workflows taking shape.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">Explore the shared workspace; payment and public enquiry integrations remain launch dependencies.</p>
            </div>
            <Link href="/features" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0B192A] hover:bg-[#F1F5F8]">
              View capabilities <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
