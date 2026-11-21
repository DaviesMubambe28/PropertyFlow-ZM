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
      <main className="site-width grid gap-6 py-12 lg:grid-cols-2 lg:py-18">
        <section className="rounded-lg bg-brand p-7 text-white sm:p-10">
          <h1 className="max-w-sm text-4xl font-semibold tracking-tight sm:text-5xl">
            See how PropertyFlow ZM fits your agency
          </h1>
          <p className="mt-6 max-w-md leading-7 text-blue-50">
            Request a walkthrough of the workspace your team can use to manage listings, enquiries, viewings and deals.
          </p>
          <dl className="mt-12 space-y-6 border-t border-white/20 pt-7">
            <div>
              <dt className="font-semibold">Property portfolio</dt>
              <dd className="mt-1 text-sm text-blue-50">Keep availability, ownership details and agent assignments together.</dd>
            </div>
            <div>
              <dt className="font-semibold">Agency operations</dt>
              <dd className="mt-1 text-sm text-blue-50">Follow an enquiry from the first conversation through to a completed transaction.</dd>
            </div>
          </dl>
        </section>
        <section className="account-card p-6 sm:p-9" aria-labelledby="demo-heading">
          <h2 id="demo-heading" className="mb-6 text-2xl font-semibold tracking-tight">Request a demo</h2>
          <DemoRequestForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
