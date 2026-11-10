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
            PropertyFlow ZM is currently a frontend prototype. It is not connected to Supabase or another shared application database. Account and workspace records created in the prototype are stored in browser local storage on the device running the app.
          </p>
          <p>
            This prototype does not provide production authentication, encrypted credential storage, server-side access controls or verified cross-organisation isolation. Do not enter real passwords, customer details, tenant information or other sensitive data.
          </p>
          <p>
            Development mode may populate the browser with synthetic users, organisations, property listings and plan examples. Those records are illustrative only. Production builds start without those seeded records.
          </p>
          <p>
            Property demo images are loaded directly from Unsplash. Visiting a page that displays these images causes the browser to request image files from Unsplash; its handling of those requests is governed by its own policies.
          </p>
          <p>
            Browser-local records can remain on the device until cleared from the browser’s site data. This page is a prototype disclosure, not a legal privacy policy or a statement of production data-handling practices.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
