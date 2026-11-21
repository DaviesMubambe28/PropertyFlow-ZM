import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#17212F]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Prototype notice</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#0B192A]">Privacy and demo data</h1>
        <div className="mt-7 space-y-6 text-sm leading-7 text-[#526174] sm:text-base">
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
