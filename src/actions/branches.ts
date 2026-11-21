"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const branchAction = z.discriminatedUnion("operation", [
  z.object({ operation: z.literal("create"), organizationId: z.uuid(), name: z.string().trim().min(2).max(120), city: z.string().trim().max(120) }),
  z.object({ operation: z.literal("member"), organizationId: z.uuid(), branchId: z.uuid(), userId: z.uuid(), role: z.enum(["member", "manager", "remove"]) }),
  z.object({ operation: z.literal("property"), organizationId: z.uuid(), branchId: z.union([z.uuid(), z.literal("")]), propertyId: z.uuid() }),
]);

export async function manageBranch(_previous: string, form: FormData) {
  const parsed = branchAction.safeParse(Object.fromEntries(form));
  if (!parsed.success) return "Check the branch details and try again.";
  const input = parsed.data;
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return "Sign in again to manage branches.";
  const { data: admin, error: adminError } = await supabase.rpc("is_active_organization_admin", {
    p_organization_id: input.organizationId,
  });
  if (adminError || admin !== true) return "Only agency administrators can manage branches.";

  if (input.operation === "create") {
    const { error } = await supabase.from("agency_branches").insert({
      organization_id: input.organizationId, name: input.name, city: input.city,
    });
    if (error) return "The branch could not be created. Check that its name is unique.";
  } else if (input.operation === "member") {
    if (input.role === "remove") {
      const { error } = await supabase.from("agency_branch_members").delete()
        .eq("organization_id", input.organizationId).eq("branch_id", input.branchId).eq("user_id", input.userId);
      if (error) return "The branch membership could not be removed.";
    } else {
      const { data: membership } = await supabase.from("organization_memberships").select("user_id")
        .eq("organization_id", input.organizationId).eq("user_id", input.userId).eq("status", "active").maybeSingle();
      if (!membership) return "Choose an active agency member.";
      const { error } = await supabase.from("agency_branch_members").upsert({
        organization_id: input.organizationId, branch_id: input.branchId, user_id: input.userId, role: input.role,
      }, { onConflict: "branch_id,user_id" });
      if (error) return "The branch membership could not be saved. A branch can have one manager.";
    }
  } else {
    const { data, error } = await supabase.from("properties").update({ branch_id: input.branchId || null })
      .eq("id", input.propertyId).eq("organization_id", input.organizationId).select("id").maybeSingle();
    if (error || !data) return "The property assignment could not be saved.";
  }

  revalidatePath("/dashboard", "layout");
  return "Branch settings saved.";
}
