"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const assignment = z.object({
  organizationId: z.uuid(), recordId: z.uuid(), assignee: z.uuid(),
  kind: z.enum(["property", "lead", "task", "viewing", "deal"]),
});

export async function reassignAgencyRecord(_previous: string, form: FormData) {
  const parsed = assignment.safeParse(Object.fromEntries(form));
  if (!parsed.success) return "Choose a record and an active staff member.";
  const { organizationId, kind, recordId, assignee } = parsed.data;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return "Sign in again to reassign work.";
  const { data, error } = await supabase.rpc("reassign_agency_record", {
    workspace: organizationId, record_kind: kind, record_id: recordId, assignee,
  });
  if (error || data !== true) return "The record could not be assigned. Check the staff member’s agency and branch access.";
  revalidatePath("/dashboard", "layout");
  return "Assignment saved.";
}
