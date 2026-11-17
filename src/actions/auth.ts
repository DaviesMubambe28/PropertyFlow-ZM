"use server";

import { getPublicEnvironment } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";
import { administratorRegistrationSchema } from "@/lib/validation/identity";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fields?: Record<string, string[] | undefined>;
};
export const initialAuthActionState: AuthActionState = { status: "idle" };
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
