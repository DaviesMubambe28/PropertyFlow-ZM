"use client";

import { useActionState } from "react";
import Link from "next/link";
import { initialAuthActionState, requestPasswordReset, updatePassword } from "@/actions/auth";

const inputClassName = "w-full rounded-xl border border-[#D8E0E8] bg-[#F9FBFC] px-3.5 py-3 text-sm outline-none focus:border-[#087F8C] focus:ring-2 focus:ring-[#087F8C]/15";

function Result({ message, success }: { message?: string; success: boolean }) {
  if (!message) return null;
  return <p role={success ? "status" : "alert"} className={`rounded-xl border p-3.5 text-sm ${success ? "border-[#ABEFC6] bg-[#ECFDF3] text-[#067647]" : "border-[#FDA29B] bg-[#FEF3F2] text-[#B42318]"}`}>{message}</p>;
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialAuthActionState);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="recovery-email" className="mb-1.5 block text-sm font-medium">Email address</label>
        <input id="recovery-email" name="email" type="email" autoComplete="email" className={inputClassName} required disabled={state.status === "success"} />
      </div>
      <Result message={state.message} success={state.status === "success"} />
      {state.status !== "success" && <button disabled={pending} className="brand-button-primary min-h-12 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white">{pending ? "Sending…" : "Send reset link"}</button>}
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialAuthActionState);
  if (state.status === "success") return <div><Result message={state.message} success /><Link href="/login" className="brand-button-primary mt-5 inline-flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-semibold text-white">Continue to sign in</Link></div>;
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium">New password</label>
        <input id="new-password" name="password" type="password" autoComplete="new-password" className={inputClassName} required />
        {state.fields?.password?.[0] && <p className="mt-1.5 text-xs text-[#B42318]">{state.fields.password[0]}</p>}
      </div>
      <div>
        <label htmlFor="confirm-new-password" className="mb-1.5 block text-sm font-medium">Confirm new password</label>
        <input id="confirm-new-password" name="confirmPassword" type="password" autoComplete="new-password" className={inputClassName} required />
        {state.fields?.confirmPassword?.[0] && <p className="mt-1.5 text-xs text-[#B42318]">{state.fields.confirmPassword[0]}</p>}
      </div>
      <Result message={state.message} success={false} />
      <button disabled={pending} className="brand-button-primary min-h-12 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white">{pending ? "Updating…" : "Update password"}</button>
    </form>
  );
}
