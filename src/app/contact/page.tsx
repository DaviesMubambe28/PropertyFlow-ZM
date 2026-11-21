import Image from "next/image";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DemoRequestForm } from "@/components/demo-request-form";

export const metadata: Metadata = {
  title: "Request an enterprise demo",
  description: "Tell us about your real estate agency and request a PropertyFlow ZM walkthrough.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-pine">Enterprise demo</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-forest sm:text-5xl">See how your agency could work in PropertyFlow ZM.</h1>
          <p className="mt-5 max-w-md leading-7 text-muted-ink">Tell us what you want to improve, from tracking leads and viewings to managing your team’s property portfolio.</p>
          <div className="mt-8 border-l-2 border-teal-700 pl-4">
            <h2 className="font-semibold">What happens after you submit?</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-ink">Your request goes to the PropertyFlow ZM team for review and follow-up by email.</p>
          </div>
            <div className="relative mt-7 aspect-[2.2] overflow-hidden rounded-2xl bg-sage">
              <Image src="/demo/apartment.jpg" alt="" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            </div>
        </section>
        <DemoRequestForm />
      </main>
      <SiteFooter />
    </>
  );
}
