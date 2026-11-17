import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#17212F]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Prototype notice</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#0B192A]">Terms of use</h1>
        <div className="mt-7 space-y-6 text-sm leading-7 text-[#526174] sm:text-base">
          <p>
            This website and application are provided as a frontend demonstration. They are not a production property-management service or a substitute for professional, legal or financial advice.
          </p>
          <p>
            Property records, names, account examples, prices and plan limits shown in development are synthetic examples. Availability, ownership, pricing and transaction details have not been verified and must not be relied on as real offers or business records.
          </p>
          <p>
            Account registration, verification, sign-in and recovery use server-backed authentication. Property and CRM workspace changes remain browser-local prototype data. Contact submission, subscription changes and payment processing are not connected.
          </p>
          <p>
            Use a unique account password and do not store personal, confidential, customer or tenant information in prototype business modules. These notices describe the current development service and are not a final customer agreement.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
