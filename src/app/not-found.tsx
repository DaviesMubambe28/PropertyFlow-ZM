import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return <>
    <SiteHeader />
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight">Page unavailable</h1>
      <p className="mt-4 text-slate-600">Check the address or browse the example property listings.</p>
      <Link href="/properties" className="brand-button-primary mt-6 inline-flex rounded-lg px-5 py-3 font-semibold">Browse properties</Link>
    </main>
    <SiteFooter />
  </>;
}
