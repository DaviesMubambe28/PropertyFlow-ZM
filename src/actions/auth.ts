"use server";

import type { AuthActionState } from "@/lib/action-state";
import { getPublicEnvironment } from "@/lib/env/public";
import { safeReturnPath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";
import {
  administratorRegistrationSchema,
  passwordResetSchema,
  recoveryRequestSchema,
  signInSchema,
} from "@/lib/validation/identity";
import { redirect } from "next/navigation";

const registrationSuccess: AuthActionState = {
  status: "success",
  message: "Check your email to verify your account and open your agency workspace.",
};

export async function registerAdministrator(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = administratorRegistrationSchema.safeParse({
    fullName: formData.get("fullName"), agencyName: formData.get("agencyName"),
    agencyEmail: formData.get("agencyEmail"), email: formData.get("email"),
    password: formData.get("password"), confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return {
    status: "error", message: "Review the highlighted fields and try again.",
    fields: parsed.error.flatten().fieldErrors,
  };

  const callbackUrl = new URL("/auth/callback", getPublicEnvironment().NEXT_PUBLIC_APP_URL);
  callbackUrl.searchParams.set("next", "/dashboard");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        pending_organization_email: parsed.data.agencyEmail,
        pending_organization_name: parsed.data.agencyName,
      },
      emailRedirectTo: callbackUrl.toString(),
    },
  });
  if (error) {
    if (["email_exists", "user_already_exists", "user_already_registered"].includes(error.code ?? "")) return registrationSuccess;
    return { status: "error", message: "We could not create the account. Please try again shortly." };
  }
  if (data.session) {
    const { error: bootstrapError } = await supabase.rpc("bootstrap_organization", {
      p_email: parsed.data.agencyEmail, p_full_name: parsed.data.fullName, p_name: parsed.data.agencyName,
    });
    if (bootstrapError) return { status: "error", message: "Your account was created, but the agency workspace could not be opened." };
  }
  return registrationSuccess;
}

export async function signIn(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return {
    status: "error",
    message: "Review the highlighted fields and try again.",
    fields: parsed.error.flatten().fieldErrors,
  };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { status: "error", message: "The email or password is incorrect." };
  return { status: "success", redirectTo: safeReturnPath(String(formData.get("next") ?? "")) };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

const recoveryConfirmation: AuthActionState = {
  status: "success",
  message: "If an account exists for that email, a password reset link is on its way.",
};

export async function requestPasswordReset(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = recoveryRequestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return {
    status: "error", message: "Enter a valid email address.", fields: parsed.error.flatten().fieldErrors,
  };
  const callbackUrl = new URL("/auth/callback", getPublicEnvironment().NEXT_PUBLIC_APP_URL);
  callbackUrl.searchParams.set("next", "/reset-password");
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: callbackUrl.toString() });
  return recoveryConfirmation;
}

export async function updatePassword(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = passwordResetSchema.safeParse({
    password: formData.get("password"), confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return {
    status: "error", message: "Review the highlighted fields and try again.", fields: parsed.error.flatten().fieldErrors,
  };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { status: "error", message: "This reset link is invalid or expired. Request a new one." };
  await supabase.auth.signOut();
  return { status: "success", message: "Your password has been updated. Sign in with your new password." };
}
