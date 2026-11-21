import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ClipboardList, ShieldCheck, UserRoundCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductTour } from "@/components/product-tour";

export const metadata: Metadata = {
  title: "Enterprise real estate operations",
  description: "Evaluate portfolio oversight, lead ownership, team access and viewing workflows for your real estate agency.",
  alternates: { canonical: "/enterprise" },
};

const capabilities = [
  { icon: Building2, title: "Portfolio oversight", body: "Review listing availability, the agency lead pipeline and completed deals from your workspace." },
  { icon: UserRoundCheck, title: "Team access and ownership", body: "Invite agents, manage their membership, assign enquiries and follow up on work from the shared records." },
  { icon: ClipboardList, title: "From enquiry to completion", body: "Link a contact and property to an enquiry, schedule a viewing, record feedback and track the sale or rental." },
  { icon: ShieldCheck, title: "Workspace permissions", body: "Signed-in users access records through active organisation membership. Database row-level policies enforce agency boundaries." },
];

export default function EnterprisePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-[#071B30] text-white">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-9 sm:py-16 xl:grid-cols-[.8fr_1.2fr] xl:items-center xl:gap-12 xl:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.17em] text-[#9cd8d4]">PropertyFlow ZM for agencies</p>
              <h1 className="mt-4 max-w-[15ch] text-[clamp(2.55rem,5vw,4.8rem)] font-semibold leading-tight tracking-[-.06em]">See how your agency operates across every deal.</h1>
              <p className="mt-5 max-w-md leading-7 text-[#c8d8e6]">Give owners a view of the portfolio and pipeline. Give agents a clear record of which clients, viewings and follow-ups are theirs.</p>
              <Link href="/contact" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#a1ded6] px-5 py-3 text-sm font-semibold text-[#071B30] hover:bg-white">Request an enterprise demo <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <ProductTour />
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What to evaluate with your team</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {capabilities.map(({ icon: Icon, title, body }) => (
              <article key={title} className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
                <Icon className="text-teal-800" aria-hidden="true" />
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-2">
            <div><h2 className="text-3xl font-semibold tracking-tight">Plan your evaluation</h2><p className="mt-3 max-w-md leading-7 text-slate-600">Use your demo request to discuss how you organise branches, prepare existing records and introduce a new workspace to your team.</p></div>
            <ol className="list-decimal space-y-3 pl-5 leading-7 text-slate-700">
              <li>Review the workspace with sample records.</li>
              <li>Walk through account setup and staff invitations.</li>
              <li>Test a representative listing, enquiry and viewing.</li>
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
