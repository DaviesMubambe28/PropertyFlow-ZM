"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAppContext } from "@/components/app-provider";
import type { OrgType } from "@/lib/types";

const accountTypes: { value: OrgType; title: string; description: string }[] = [
  { value: "agency", title: "Real estate agency", description: "A shared workspace for a property team." },
  { value: "independent_agent", title: "Independent agent", description: "A focused workspace for an individual agent." },
  { value: "landlord", title: "Landlord / property manager", description: "A workspace for property operations; rental tools are still in development." },
];

const stepNames = ["Account type", "Account details", "Workspace", "Review"];

export function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const router = useRouter();
  const { signIn, registerUser } = useAppContext();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<OrgType>("agency");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === "login") {
      const result = signIn(email, password);
      if (result) {
        setError(result);
        return;
      }
    } else {
      if (step !== stepNames.length) {
        return;
      }

      const result = registerUser(fullName, email, password, orgName, accountType);
      if (result) {
        setError(result);
        return;
      }
    }

    router.push("/dashboard");
  }

  function continueRegistration(button: HTMLButtonElement) {
    if (button.form?.reportValidity()) {
      setError(null);
      setStep((currentStep) => Math.min(currentStep + 1, stepNames.length));
    }
  }

  return (
    <section className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-[0_20px_50px_rgba(11,25,42,0.07)] sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">
          {mode === "login" ? "Welcome back" : "Create a workspace"}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B192A] sm:text-3xl">
          {mode === "login" ? "Sign in to your workspace" : "Get started with PropertyFlow ZM"}
        </h1>
      </div>

      <div role="note" className="mb-6 rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-3.5 py-3 text-xs leading-5 text-[#526174]">
        Prototype only: account credentials and workspace records are stored unencrypted in this browser. There is no email verification or password recovery service. Do not use real customer data or a reused password.
      </div>

      {mode === "register" && (
        <ol aria-label="Registration progress" className="mb-6 grid grid-cols-4 gap-1.5">
          {stepNames.map((name, index) => {
            const stepNumber = index + 1;
            const isCurrent = stepNumber === step;
            const isDone = stepNumber < step;
            return (
              <li key={name} aria-current={isCurrent ? "step" : undefined} className="min-w-0">
                <div className={`h-1 rounded-full ${isDone || isCurrent ? "bg-[#087F8C]" : "bg-[#E5EAF0]"}`} />
                <span className={`mt-2 block truncate text-[10px] font-medium sm:text-xs ${isCurrent ? "text-[#142A43]" : "text-[#8A96A5]"}`}>{name}</span>
              </li>
            );
          })}
        </ol>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "register" && step === 1 && (
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-[#17212F]">Which best describes your work?</legend>
            <div className="space-y-2.5">
              {accountTypes.map((option) => (
                <label key={option.value} className={`flex cursor-pointer gap-3 rounded-xl border p-3.5 transition ${accountType === option.value ? "border-[#087F8C] bg-[#F1FAFA] ring-1 ring-[#087F8C]/20" : "border-[#E5EAF0] hover:bg-[#F9FBFC]"}`}>
                  <input
                    type="radio"
                    name="accountType"
                    value={option.value}
                    checked={accountType === option.value}
                    onChange={() => setAccountType(option.value)}
                    className="mt-1 accent-[#087F8C]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#17212F]">{option.title}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-[#667085]">{option.description}</span>
                  </span>
                </label>
              ))}
            </div>
            <button type="button" onClick={(event) => continueRegistration(event.currentTarget)} className="brand-button-primary mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white">
              Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </fieldset>
        )}

        {mode === "register" && step === 2 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="register-name" className="mb-1.5 block text-sm font-medium text-[#17212F]">Full name</label>
              <input id="register-name" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder="Your name" required />
            </div>
            <div>
              <label htmlFor="register-email" className="mb-1.5 block text-sm font-medium text-[#17212F]">Email address</label>
              <input id="register-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="register-password" className="mb-1.5 block text-sm font-medium text-[#17212F]">Password</label>
              <div className="relative">
                <input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 pr-11 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder="At least 8 characters" required />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[#667085]" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { setError(null); setStep(1); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#E5EAF0] px-4 py-3 text-sm font-medium text-[#526174] hover:bg-[#F7F9FC]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </button>
              <button type="button" onClick={(event) => continueRegistration(event.currentTarget)} className="brand-button-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white">
                Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {mode === "register" && step === 3 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-[#17212F]">Workspace details</p>
              <p className="mt-1 text-xs leading-5 text-[#667085]">
                {accountType === "agency"
                  ? "Add the name your agency team will see."
                  : "Agency details are not needed. You can optionally name your personal workspace."}
              </p>
            </div>
            <div>
              <label htmlFor="register-workspace" className="mb-1.5 block text-sm font-medium text-[#17212F]">
                {accountType === "agency" ? "Agency name" : "Workspace name (optional)"}
              </label>
              <input id="register-workspace" autoComplete="organization" value={orgName} onChange={(event) => setOrgName(event.target.value)} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder={accountType === "agency" ? "Your agency" : "Leave blank to use your name"} required={accountType === "agency"} />
            </div>
            {accountType === "landlord" && (
              <p className="rounded-xl border border-[#E8D9B7] bg-[#FFF9ED] p-3 text-xs leading-5 text-[#76500A]">
                Landlord and tenancy management features are still in development. This creates a demo workspace only.
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { setError(null); setStep(2); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#E5EAF0] px-4 py-3 text-sm font-medium text-[#526174] hover:bg-[#F7F9FC]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </button>
              <button type="button" onClick={(event) => continueRegistration(event.currentTarget)} className="brand-button-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white">
                Review details <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {mode === "register" && step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-[#17212F]">Review your details</h2>
              <p className="mt-1 text-xs text-[#667085]">A local demonstration account will be created in this browser only.</p>
            </div>
            <dl className="divide-y divide-[#E5EAF0] rounded-xl border border-[#E5EAF0] px-4">
              <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                <dt className="text-[#667085]">Account type</dt>
                <dd className="font-medium text-[#17212F]">{accountTypes.find((option) => option.value === accountType)?.title}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                <dt className="text-[#667085]">Name</dt>
                <dd className="font-medium text-[#17212F]">{fullName}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                <dt className="text-[#667085]">Email</dt>
                <dd className="break-all font-medium text-[#17212F]">{email}</dd>
              </div>
              {orgName.trim() && (
                <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <dt className="text-[#667085]">Workspace</dt>
                  <dd className="font-medium text-[#17212F]">{orgName}</dd>
                </div>
              )}
            </dl>
            <p className="text-xs leading-5 text-[#667085]">Email verification, secure authentication and password recovery are not available in this prototype.</p>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { setError(null); setStep(3); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#E5EAF0] px-4 py-3 text-sm font-medium text-[#526174] hover:bg-[#F7F9FC]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </button>
              <button type="submit" className="brand-button-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white">
                Create local workspace <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {mode === "login" && (
          <>
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-[#17212F]">Email address</label>
              <input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder="you@example.com" required />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label htmlFor="login-password" className="text-sm font-medium text-[#17212F]">Password</label>
                <span className="text-xs text-[#8A96A5]">Password reset unavailable</span>
              </div>
              <div className="relative">
                <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 pr-11 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[#667085]" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>
            <button type="submit" className="brand-button-primary inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white">
              Sign in <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}

        {error && <p role="alert" className="rounded-xl border border-[#C33434]/20 bg-[#FFF5F5] px-3 py-2.5 text-sm text-[#A52A2A]">{error}</p>}
      </form>

      <p className="mt-6 border-t border-[#E5EAF0] pt-5 text-sm text-[#667085]">
        {mode === "login" ? "New to PropertyFlow ZM?" : "Already have a local demo account?"}{" "}
        <Link href={mode === "login" ? "/register" : "/login"} className="font-semibold text-[#087F8C] underline decoration-[#087F8C]/30 underline-offset-4 hover:text-[#066875]">
          {mode === "login" ? "Create a demo workspace" : "Sign in"}
        </Link>
      </p>
    </section>
  );
}
