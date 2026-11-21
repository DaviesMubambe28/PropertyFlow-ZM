import { AccountPanel } from "@/components/account-panel";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/recovery-forms";

export default function ForgotPasswordPage() {
  return <AccountPanel>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">Account recovery</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-3 text-sm leading-6 text-muted-ink">Enter your account email. For privacy, the confirmation is the same whether or not an account exists.</p>
      <div className="mt-6"><ForgotPasswordForm /></div>
      <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-pine">Back to sign in</Link>
    </AccountPanel>;
}
