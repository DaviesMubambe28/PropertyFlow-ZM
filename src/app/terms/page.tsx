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
            Account actions and workspace changes are prototype-only and stored locally in the browser. The application does not currently provide email verification, shared team accounts, production security controls, contact submission, subscription changes or real payment processing.
          </p>
          <p>
            Do not use the prototype to store personal, confidential, customer or tenant information, or credentials used for another service. These notices describe the current demo and are not a binding customer agreement.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
