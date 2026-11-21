"use server";

import { revalidatePath } from "next/cache";
import { getDemoStaff } from "@/lib/auth/demo-staff";
import { createAdminClient } from "@/lib/supabase/admin";
import { demoRequestSchema, demoReviewSchema } from "@/lib/validation/demo";

export type DemoFormState = { status: "idle" | "success" | "error"; message: string };

export async function submitDemoRequest(_: DemoFormState, form: FormData): Promise<DemoFormState> {
  const unavailable: DemoFormState = {
    status: "error",
    message: "We couldn't save your request. Please try again later.",
  };
  if (form.get("website")) return unavailable;
  const parsed = demoRequestSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    return { status: "error", message: "Check your name, company, business email, phone and team size, then try again." };
  }

  const { fullName, company, email, phone, teamSize, requirements } = parsed.data;
  try {
    const { data, error } = await createAdminClient().rpc("submit_enterprise_demo", {
      p_full_name: fullName, p_company: company, p_email: email,
      p_phone: phone, p_team_size: teamSize, p_requirements: requirements,
    });
    if (error) return unavailable;
    if (data === false) return { status: "error", message: "The request limit has been reached. Please try again later." };
    if (data !== true) return unavailable;
    return { status: "success", message: "Your demo request was saved. Our team can follow up using your business email." };
  } catch {
    return unavailable;
  }
}

export async function reviewDemoRequest(_: DemoFormState, form: FormData): Promise<DemoFormState> {
  const staff = await getDemoStaff();
  if (!staff) return { status: "error", message: "Staff access is required." };
  const parsed = demoReviewSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { status: "error", message: "Check the status, assignment and note before saving." };

  const { id, status, assignment, note } = parsed.data;
  const { data, error } = await createAdminClient().rpc("review_enterprise_demo", {
    p_id: id, p_actor: staff.id, p_status: status, p_assignment: assignment, p_note: note,
  });
  if (error || data !== true) return { status: "error", message: "The update could not be saved." };
  revalidatePath("/staff/demo-requests");
  return { status: "success", message: "Follow-up saved." };
}
