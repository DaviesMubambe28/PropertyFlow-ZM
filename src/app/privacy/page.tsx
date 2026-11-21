import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main className="site-width py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Prototype notice</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-brand sm:text-5xl">Privacy and demo data</h1>
        <div className="mt-7 max-w-3xl space-y-6 border-t border-line pt-7 text-sm leading-7 text-quiet sm:text-base">
          <p>
            PropertyFlow ZM uses Supabase for account authentication, email verification, password recovery, agency identity and membership access. Authentication sessions are held in secure HTTP-only cookies rather than browser local storage.
          </p>
          <p>
            Agency identity, property, contact, lead, viewing, task and deal records are protected by server-side authorization and PostgreSQL row-level security. Access is limited to active members of the relevant agency.
          </p>
          <p>
            When you request a demo, we store your contact details, company information and message so authorised sales staff can respond and keep a record of their follow-up.
          </p>
          <p>
            Development mode may populate the browser with synthetic users, organisations, property listings and plan examples. Those records are illustrative only. Production builds start without those seeded records.
          </p>
          <p>
            Property demo images are loaded directly from Unsplash. Visiting a page that displays these images causes the browser to request image files from Unsplash; its handling of those requests is governed by its own policies.
          </p>
          <p>
            Legacy browser-local workspace state is cleared when an authenticated workspace loads. This page is a development-stage disclosure and must be reviewed before a production launch.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
