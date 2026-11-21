import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { EvaluationPricing } from "@/components/evaluation-pricing";

export const metadata: Metadata = { title: "Agency workspace pricing", alternates: { canonical: "/pricing" } };

export default function PricingPage() {
  return <>
    <SiteHeader />
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
      <h1 className="mb-4 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Plans for your agency workspace</h1>
      <EvaluationPricing />
    </main>
    <SiteFooter />
  </>;
}
