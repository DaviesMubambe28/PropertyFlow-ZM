import { AccountPanel } from "@/components/account-panel";
import { ResetPasswordForm } from "@/components/recovery-forms";

export const instant = false;

export default function ResetPasswordPage() {
  return <AccountPanel>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">Secure password reset</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Choose a new password</h1>
      <p className="mt-3 text-sm leading-6 text-muted-ink">Use 8–72 characters with uppercase, lowercase, and a number.</p>
      <div className="mt-6"><ResetPasswordForm /></div>
    </AccountPanel>;
}
