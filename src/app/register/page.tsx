import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ShieldCheck, UsersRound } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AdministratorRegistrationForm } from "@/components/administrator-registration-form";

const audiences = [
  { icon: Building2, title: "One agency workspace", detail: "Keep the team and portfolio together" },
  { icon: UsersRound, title: "Role-based access", detail: "Invite agents after verification" },
  { icon: ShieldCheck, title: "Secure by default", detail: "Verified email and isolated agency data" },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main className="site-width py-10 sm:py-14 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <section className="account-card p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">A workspace for your work</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-deep sm:text-4xl">Start with the way you manage property.</h1>
            <p className="mt-4 text-sm leading-6 text-quiet">
              Create the secure workspace your agency will use to manage listings, leads, and team activity.
            </p>
            <div className="mt-7 space-y-3">
              {audiences.map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex items-center gap-3 rounded-xl border border-line bg-canvas p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tint text-brand">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{title}</span>
                    <span className="mt-0.5 block text-xs text-quiet">{detail}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#E8D9B7] bg-[#FFF9ED] p-3.5 text-xs leading-5 text-[#76500A]">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>Your account remains inactive until you confirm the verification link sent to your email address.</p>
            </div>
            <Link href="/features" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover">
              See available capabilities <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
          <AdministratorRegistrationForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
