import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ContactRound, Home } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AuthForm } from "@/components/auth-form";

const audiences = [
  { icon: Building2, title: "Agency", detail: "A team workspace" },
  { icon: ContactRound, title: "Independent agent", detail: "A focused solo workspace" },
  { icon: Home, title: "Landlord", detail: "Property operations preview" },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#17212F]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <section className="rounded-[24px] border border-[#E5EAF0] bg-white p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">A workspace for your work</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#0B192A] sm:text-4xl">Start with the way you manage property.</h1>
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              Choose an account type, add your account details and review your workspace before creating a local demo account.
            </p>
            <div className="mt-7 space-y-3">
              {audiences.map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex items-center gap-3 rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF6F7] text-[#087F8C]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#17212F]">{title}</span>
                    <span className="mt-0.5 block text-xs text-[#667085]">{detail}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#E8D9B7] bg-[#FFF9ED] p-3.5 text-xs leading-5 text-[#76500A]">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>Prototype only. No account verification, secure server-side authentication or shared database is connected. Avoid real customer data and reused passwords.</p>
            </div>
            <Link href="/features" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#087F8C] hover:text-[#066875]">
              See available capabilities <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
          <AuthForm mode="register" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
