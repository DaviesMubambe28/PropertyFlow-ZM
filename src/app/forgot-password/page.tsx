import Link from "next/link";
import { ForgotPasswordForm } from "@/components/recovery-forms";

export default function ForgotPasswordPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-5 py-12">
    <section className="w-full max-w-md rounded-[24px] border border-[#E5EAF0] bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Account recovery</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-3 text-sm leading-6 text-[#667085]">Enter your account email. For privacy, the confirmation is the same whether or not an account exists.</p>
      <div className="mt-6"><ForgotPasswordForm /></div>
      <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-[#087F8C]">Back to sign in</Link>
    </section>
  </main>;
}
