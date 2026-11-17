"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { organizationProfileSchema } from "@/lib/validation/organization";

export type OrganizationActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fields?: Record<string, string[] | undefined>;
};
export const initialOrganizationState: OrganizationActionState = { status: "idle" };

export async function updateOrganizationProfile(_state: OrganizationActionState, formData: FormData): Promise<OrganizationActionState> {
  const parsed = organizationProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return {
    status: "error", message: "Review the highlighted fields and try again.", fields: parsed.error.flatten().fieldErrors,
  };
  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data.user) return { status: "error", message: "Sign in again before updating the agency." };
  const { error } = await supabase.from("organizations").update({
    name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone,
    location: parsed.data.location, logo_url: parsed.data.logoUrl || null,
    timezone: parsed.data.timezone, currency: parsed.data.currency,
  }).eq("id", parsed.data.organizationId);
  if (error) return { status: "error", message: "Only an agency administrator can update these settings." };
  revalidatePath("/dashboard");
  return { status: "success", message: "Agency profile updated." };
}
