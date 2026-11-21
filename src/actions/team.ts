"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPublicEnvironment } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { invitationAcceptanceSchema, invitationInputSchema, membershipRoleSchema, membershipStatusSchema } from "@/lib/validation/team";

export type TeamActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  invitePath?: string;
};
export async function inviteAgent(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const parsed = invitationInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Enter a valid agent email address." };
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return { status: "error", message: "Sign in again before inviting an agent." };
  const { data, error } = await supabase.from("organization_invitations").insert({
    organization_id: parsed.data.organizationId, email: parsed.data.email, role: "agent",
    invited_by: auth.user.id, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }).select("id").single();
  if (error || !data) return { status: "error", message: "A pending invitation may already exist for this email." };

  const invitePath = `/invitations/${data.id}`;
  const callbackUrl = new URL("/auth/callback", getPublicEnvironment().NEXT_PUBLIC_APP_URL);
  callbackUrl.searchParams.set("next", invitePath);
  try {
    const admin = createAdminClient();
    await admin.auth.admin.inviteUserByEmail(parsed.data.email, { redirectTo: callbackUrl.toString() });
  } catch {
    // The invitation record and shareable path remain usable when SMTP is unavailable.
  }
  revalidatePath("/dashboard/settings/team");
  return { status: "success", message: "Invitation created. It expires in seven days.", invitePath };
}

export async function setMembershipStatus(formData: FormData) {
  const parsed = membershipStatusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClient();
  await supabase.from("organization_memberships").update({ status: parsed.data.status })
    .eq("organization_id", parsed.data.organizationId).eq("user_id", parsed.data.userId).eq("role", "agent");
  revalidatePath("/dashboard/settings/team");
}

export async function setMembershipRole(_previous: string, formData: FormData) {
  const parsed = membershipRoleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return "Choose a valid team member and role.";
  const { organizationId, userId, role } = parsed.data;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return "Sign in again to manage staff roles.";
  if (auth.user.id === userId) return "Ask another administrator to change your role.";

  const { data, error } = await supabase.from("organization_memberships").update({ role })
    .eq("organization_id", organizationId).eq("user_id", userId).eq("status", "active").select("user_id").maybeSingle();
  if (error || !data) return "The role could not be changed. Check administrator access and the member’s status.";
  revalidatePath("/dashboard/settings/team");
  return "Member role updated.";
}

export async function revokeInvitation(formData: FormData) {
  const parsed = invitationAcceptanceSchema.safeParse({ invitationId: formData.get("invitationId") });
  if (!parsed.success) return;
  const supabase = await createClient();
  await supabase.from("organization_invitations").update({ status: "revoked" }).eq("id", parsed.data.invitationId).eq("status", "pending");
  revalidatePath("/dashboard/settings/team");
}

export async function acceptInvitation(formData: FormData) {
  const parsed = invitationAcceptanceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/login?error=invalid_invitation");
  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_organization_invitation", { p_invitation_id: parsed.data.invitationId });
  if (error) redirect(`/invitations/${parsed.data.invitationId}?error=unavailable`);
  redirect("/dashboard");
}
