import { EditorialIntro } from "@/components/editorial-intro";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { EvaluationPricing } from "@/components/evaluation-pricing";

export const metadata: Metadata = { title: "Agency workspace pricing", alternates: { canonical: "/pricing" } };

export default function PricingPage() {
  return <>
    <SiteHeader />
    <main>
      <EditorialIntro label="Pricing" title="Plans for your agency workspace" image="apartment">
        <p className="mt-4 max-w-sm leading-7 text-muted-ink">Find a workspace for your portfolio, enquiries and team.</p>
      </EditorialIntro>
      <div className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 sm:pb-20"><EvaluationPricing /></div>
    </main>
    <SiteFooter />
  </>;
}
