"use server";

import { revalidatePath } from "next/cache";
import { getSalesStaffId } from "@/lib/auth/sales-staff";
import { createAdminClient } from "@/lib/supabase/admin";
import { demoRequestSchema, demoUpdateSchema } from "@/lib/validation/demo";

export async function submitDemoRequest(_previous: string | null, formData: FormData) {
  const parsed = demoRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return "Check your contact details and try again.";
  if (formData.get("website")) return "received";

  try {
    const { data, error } = await createAdminClient().rpc("submit_demo_request", {
      payload: parsed.data,
    });
    if (error) return "We couldn’t save your request. Please try again later.";
    return data === true ? "received" : "Too many requests right now. Please try again shortly.";
  } catch {
    return "We couldn’t save your request. Please try again later.";
  }
}

export async function updateDemoRequest(_previous: string | null, formData: FormData) {
  const staffId = await getSalesStaffId();
  if (!staffId) return "You do not have access to update demo requests.";
  const parsed = demoUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return "Check the status and keep the note under 2,000 characters.";

  const { data, error } = await createAdminClient().rpc("update_demo_request", {
    request_id: parsed.data.id,
    staff_id: staffId,
    next_status: parsed.data.status,
    note: parsed.data.note,
  });
  if (error || data !== true) return "The request could not be updated.";
  revalidatePath("/staff/demo-requests");
  return "Update saved.";
}
