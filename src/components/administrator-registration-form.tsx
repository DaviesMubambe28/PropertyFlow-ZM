"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { registerAdministrator } from "@/actions/auth";
import { initialAuthActionState } from "@/lib/action-state";

const inputClassName = "w-full rounded-xl border border-[#D8E0E8] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F] outline-none transition placeholder:text-[#8A96A5] focus:border-[#087F8C] focus:ring-2 focus:ring-[#087F8C]/15";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return <p id={id} className="mt-1.5 text-xs text-[#B42318]">{errors[0]}</p>;
}

export function AdministratorRegistrationForm() {
  const [state, formAction, pending] = useActionState(registerAdministrator, initialAuthActionState);
  const [showPasswords, setShowPasswords] = useState(false);

  if (state.status === "success") return (
    <section className="rounded-[24px] border border-[#C6E7E4] bg-white p-6 shadow-[0_20px_50px_rgba(11,25,42,0.07)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">One final step</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0B192A]">Verify your email</h2>
      <p className="mt-3 text-sm leading-6 text-[#526174]">{state.message}</p>
      <p className="mt-4 rounded-xl bg-[#F1FAFA] p-4 text-sm leading-6 text-[#315E62]">The verification link creates your agency workspace and signs you in securely. Check your spam folder if it does not arrive shortly.</p>
      <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#087F8C]">Return to sign in <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </section>
  );

  const field = (name: string) => state.fields?.[name];
  return (
    <section className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-[0_20px_50px_rgba(11,25,42,0.07)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Administrator registration</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B192A] sm:text-3xl">Create your agency workspace</h2>
      <p className="mt-2 text-sm leading-6 text-[#667085]">You will be the first administrator. Verify your email before inviting the rest of your team.</p>
      <form action={formAction} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">Full name</label>
          <input id="fullName" name="fullName" autoComplete="name" className={inputClassName} required aria-invalid={Boolean(field("fullName"))} aria-describedby={field("fullName") ? "fullName-error" : undefined} />
          <FieldError id="fullName-error" errors={field("fullName")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="agencyName" className="mb-1.5 block text-sm font-medium">Agency name</label>
            <input id="agencyName" name="agencyName" autoComplete="organization" className={inputClassName} required aria-invalid={Boolean(field("agencyName"))} />
            <FieldError id="agencyName-error" errors={field("agencyName")} />
          </div>
          <div>
            <label htmlFor="agencyEmail" className="mb-1.5 block text-sm font-medium">Agency email</label>
            <input id="agencyEmail" name="agencyEmail" type="email" autoComplete="organization email" className={inputClassName} required aria-invalid={Boolean(field("agencyEmail"))} />
            <FieldError id="agencyEmail-error" errors={field("agencyEmail")} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" className={inputClassName} required aria-invalid={Boolean(field("email"))} />
          <FieldError id="email-error" errors={field("email")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
            <input id="password" name="password" type={showPasswords ? "text" : "password"} autoComplete="new-password" className={inputClassName} required aria-invalid={Boolean(field("password"))} />
            <FieldError id="password-error" errors={field("password")} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">Confirm password</label>
            <input id="confirmPassword" name="confirmPassword" type={showPasswords ? "text" : "password"} autoComplete="new-password" className={inputClassName} required aria-invalid={Boolean(field("confirmPassword"))} />
            <FieldError id="confirmPassword-error" errors={field("confirmPassword")} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs leading-5 text-[#667085]">Use 8–72 characters with uppercase, lowercase, and a number.</p>
          <button type="button" onClick={() => setShowPasswords((visible) => !visible)} className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-xs font-semibold text-[#087F8C]" aria-pressed={showPasswords}>
            {showPasswords ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            {showPasswords ? "Hide passwords" : "Show passwords"}
          </button>
        </div>
        {state.message && <p role="alert" className="rounded-xl border border-[#FDA29B] bg-[#FEF3F2] p-3.5 text-sm text-[#B42318]">{state.message}</p>}
        <button type="submit" disabled={pending} className="brand-button-primary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-70">
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          {pending ? "Creating workspace…" : "Create secure workspace"}
        </button>
      </form>
      <p className="mt-5 text-center text-xs leading-5 text-[#667085]">By continuing, you agree to the <Link href="/terms" className="font-medium text-[#087F8C]">Terms</Link> and <Link href="/privacy" className="font-medium text-[#087F8C]">Privacy Policy</Link>.</p>
    </section>
  );
}
