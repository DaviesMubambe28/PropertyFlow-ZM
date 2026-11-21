import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main className="site-width py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Prototype notice</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-brand sm:text-5xl">Terms of use</h1>
        <div className="mt-7 max-w-3xl space-y-6 border-t border-line pt-7 text-sm leading-7 text-quiet sm:text-base">
          <p>
            This website and application are provided as a frontend demonstration. They are not a production property-management service or a substitute for professional, legal or financial advice.
          </p>
          <p>
            Property records, names, account examples, prices and plan limits shown in development are synthetic examples. Availability, ownership, pricing and transaction details have not been verified and must not be relied on as real offers or business records.
          </p>
          <p>
            Account registration, verification, sign-in, recovery, agency administration, properties and CRM workflows use the shared service. Public contact submission, subscription changes and payment processing are not connected.
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
