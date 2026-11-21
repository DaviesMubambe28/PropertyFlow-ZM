import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">Prototype notice</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-forest">Terms of use</h1>
        <div className="mt-7 space-y-6 rounded-3xl border border-line bg-white p-6 text-sm sm:p-10 leading-7 text-muted-ink sm:text-base">
          <p>
            This website and application are provided as a frontend demonstration. They are not a production property-management service or a substitute for professional, legal or financial advice.
          </p>
          <p>
            Property records, names, account examples, prices and plan limits shown in development are synthetic examples. Availability, ownership, pricing and transaction details have not been verified and must not be relied on as real offers or business records.
          </p>
          <p>
            Account registration, verification, sign-in, recovery, agency administration, properties and CRM workflows use the shared service. The enterprise demo form records requests for staff review. Subscription changes and payment processing require a separate agreement.
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
