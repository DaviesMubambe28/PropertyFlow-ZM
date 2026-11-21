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
            PropertyFlow ZM is an agency workspace under development. Information on this site does not replace professional, legal or financial advice.
          </p>
          <p>
            Sample workspace records are illustrative. The public directory displays listings selected by participating agencies. Confirm availability, ownership and pricing with the responsible agency before making decisions.
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
