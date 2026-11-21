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
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Property operations for the way your team works.</h1>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {solutions.map(({ icon: Icon, title, body, href, action }) => <article key={title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6">
          <Icon className="text-teal-800" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold">{title}</h2>
          <p className="mt-2 flex-1 leading-7 text-slate-600">{body}</p>
          <Link href={href} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-teal-800">{action} <ArrowRight size={15} aria-hidden="true" /></Link>
        </article>)}
      </div>
    </main>
    <SiteFooter />
  </>;
}
