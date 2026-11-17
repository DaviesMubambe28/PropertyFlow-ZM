import { ResetPasswordForm } from "@/components/recovery-forms";

export const instant = false;

export default function ResetPasswordPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-5 py-12">
    <section className="w-full max-w-md rounded-[24px] border border-[#E5EAF0] bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Secure password reset</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Choose a new password</h1>
      <p className="mt-3 text-sm leading-6 text-[#667085]">Use 8–72 characters with uppercase, lowercase, and a number.</p>
      <div className="mt-6"><ResetPasswordForm /></div>
    </section>
  </main>;
}
