import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Building2, ContactRound, ListChecks } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "@/components/login-form";
import { safeReturnPath } from "@/lib/auth/redirects";

const previewItems = [
  { icon: Building2, label: "Property records" },
  { icon: ContactRound, label: "Client contacts" },
  { icon: ListChecks, label: "Lead pipeline" },
  { icon: BarChart3, label: "Workspace overview" },
];

export const instant = false;

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <section className="relative overflow-hidden rounded-[24px] bg-forest p-6 text-white sm:p-8 lg:p-10">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint">PropertyFlow ZM workspace</p>
              <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Your property work, brought together.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                Sign in with your verified account. Your session is protected using secure, HTTP-only cookies.
              </p>
              <ul className="mt-7 grid gap-2 sm:grid-cols-2">
                {previewItems.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200">
                    <Icon className="h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-xs leading-5 text-slate-400">Agency access is verified on the server before dashboard content is rendered.</p>
              <Link href="/features" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-mint">
                Explore platform capabilities <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="relative mt-7 aspect-[2.2] overflow-hidden rounded-2xl bg-sage">
              <Image src="/demo/office.jpg" alt="" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            </div>
          </section>
          <LoginForm next={safeReturnPath(next ?? null)} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
