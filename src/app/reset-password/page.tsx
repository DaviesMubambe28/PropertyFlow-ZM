import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ResetPasswordForm } from "@/components/recovery-forms";

export const instant = false;

export default function ResetPasswordPage() {
  return <><SiteHeader /><main className="flex min-h-[60vh] items-center justify-center bg-canvas px-5 py-12">
    <section className="w-full max-w-md account-card p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Secure password reset</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Choose a new password</h1>
      <p className="mt-3 text-sm leading-6 text-quiet">Use 8–72 characters with uppercase, lowercase, and a number.</p>
      <div className="mt-6"><ResetPasswordForm /></div>
    </section>
  </main><SiteFooter /></>;
}
