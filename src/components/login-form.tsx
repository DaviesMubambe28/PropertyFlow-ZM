"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { initialAuthActionState, signIn } from "@/actions/auth";

const inputClassName = "w-full rounded-xl border border-line bg-canvas px-3.5 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialAuthActionState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) router.replace(state.redirectTo);
  }, [router, state]);

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-[0_20px_50px_rgba(11,25,42,0.07)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Welcome back</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-deep sm:text-3xl">Sign in to your workspace</h1>
      <form action={formAction} className="mt-6 space-y-4" noValidate>
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium">Email address</label>
          <input id="login-email" name="email" type="email" autoComplete="email" className={inputClassName} required aria-invalid={Boolean(state.fields?.email)} />
          {state.fields?.email?.[0] && <p className="mt-1.5 text-xs text-[#B42318]">{state.fields.email[0]}</p>}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="login-password" className="text-sm font-medium">Password</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-brand">Forgot password?</Link>
          </div>
          <input id="login-password" name="password" type="password" autoComplete="current-password" className={inputClassName} required aria-invalid={Boolean(state.fields?.password)} />
          {state.fields?.password?.[0] && <p className="mt-1.5 text-xs text-[#B42318]">{state.fields.password[0]}</p>}
        </div>
        {state.message && <p role="alert" className="rounded-xl border border-[#FDA29B] bg-[#FEF3F2] p-3.5 text-sm text-[#B42318]">{state.message}</p>}
        <button type="submit" disabled={pending} className="brand-button-primary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-70">
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          {pending ? "Signing in…" : "Sign in securely"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-quiet">New to PropertyFlow ZM? <Link href="/register" className="font-semibold text-brand">Create an agency workspace</Link></p>
    </section>
  );
}
