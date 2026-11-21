import type { Metadata } from "next";
import { DemoRequestForm } from "@/components/demo-request-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Request a demo | PropertyFlow ZM",
  description: "Request a walkthrough of PropertyFlow ZM for your real estate agency.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-24">
        <section className="rounded-3xl bg-[#142A43] p-7 text-white sm:p-10">
          <h1 className="max-w-sm text-4xl font-semibold tracking-tight sm:text-5xl">
            See how PropertyFlow ZM fits your agency
          </h1>
          <p className="mt-6 max-w-md leading-7 text-slate-200">
            Request a walkthrough of the workspace your team can use to manage listings, enquiries, viewings and deals.
          </p>
          <dl className="mt-12 space-y-6 border-t border-white/20 pt-7">
            <div>
              <dt className="font-semibold">Property portfolio</dt>
              <dd className="mt-1 text-sm text-slate-200">Keep availability, ownership details and agent assignments together.</dd>
            </div>
            <div>
              <dt className="font-semibold">Agency operations</dt>
              <dd className="mt-1 text-sm text-slate-200">Follow an enquiry from the first conversation through to a completed transaction.</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-9" aria-labelledby="demo-heading">
          <h2 id="demo-heading" className="mb-6 text-2xl font-semibold tracking-tight">Request a demo</h2>
          <DemoRequestForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
