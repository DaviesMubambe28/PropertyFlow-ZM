import { EditorialIntro } from "@/components/editorial-intro";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ContactRound, KeyRound } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Solutions for property businesses",
  alternates: { canonical: "/solutions" },
};

const solutions = [
  { icon: Building2, title: "Real estate agencies", body: "Keep a shared record of properties, clients and enquiries. Assign leads, organise viewings and review completed sales and rental deals.", href: "/enterprise", action: "Explore agency workflows" },
  { icon: ContactRound, title: "Independent agents", body: "Maintain your working portfolio, follow up with prospective clients and keep deal history together in one place.", href: "/register", action: "Create a workspace" },
  { icon: KeyRound, title: "Rental and commercial teams", body: "Record available space, property owners, prospective tenants and agreed rental deals. Track viewings and outcomes in the workspace.", href: "/contact", action: "Discuss your workflow" },
];

export default function SolutionsPage() {
  return <>
    <SiteHeader />
    <main>
      <EditorialIntro label="Solutions" title="Property operations for the way your team works." image="house" />
      <div className="mx-auto grid max-w-7xl gap-5 px-5 pb-14 sm:px-8 lg:grid-cols-3">
        {solutions.map(({ icon: Icon, title, body, href, action }) => <article key={title} className="flex flex-col rounded-xl border border-line bg-white p-6">
          <Icon className="text-pine" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold">{title}</h2>
          <p className="mt-2 flex-1 leading-7 text-muted-ink">{body}</p>
          <Link href={href} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-pine">{action} <ArrowRight size={15} aria-hidden="true" /></Link>
        </article>)}
      </div>
    </main>
    <SiteFooter />
  </>;
}
