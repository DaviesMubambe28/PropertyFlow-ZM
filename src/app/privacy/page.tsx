import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">Prototype notice</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-forest">Privacy and demo data</h1>
        <div className="mt-7 space-y-6 rounded-3xl border border-line bg-white p-6 text-sm sm:p-10 leading-7 text-muted-ink sm:text-base">
          <p>
            PropertyFlow ZM uses Supabase for account authentication, email verification, password recovery, agency identity and membership access. Authentication sessions are held in secure HTTP-only cookies rather than browser local storage.
          </p>
          <p>
            Demo requests include the contact and company details you submit. Authorised platform staff use those details to review and follow up on the request. Agency identity, property, contact, lead, viewing, task and deal records are protected by server-side authorization and PostgreSQL row-level security. Access is limited to active members of the relevant agency.
          </p>
          <p>
            Development mode may populate the browser with synthetic users, organisations, property listings and plan examples. Those records are illustrative only. Production builds start without those seeded records.
          </p>
          <p>
            The example property photographs are sourced from Unsplash and served with PropertyFlow ZM.
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
