import { DashboardShell } from "@/components/dashboard-shell";
import { TeamManager } from "@/components/team-manager";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function TeamSettingsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data: ownMembership } = await supabase.from("organization_memberships")
    .select("organization_id, role").eq("user_id", auth.user.id).eq("status", "active").order("created_at").limit(1).maybeSingle();
  if (!ownMembership || ownMembership.role !== "admin") return <DashboardShell><p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Only an agency administrator can manage the team.</p></DashboardShell>;

  const [memberResult, invitationResult] = await Promise.all([
    supabase.from("organization_memberships").select("user_id, role, status, profiles!organization_memberships_user_id_fkey(full_name)").eq("organization_id", ownMembership.organization_id).order("created_at"),
    supabase.from("organization_invitations").select("id, email, status, expires_at").eq("organization_id", ownMembership.organization_id).eq("status", "pending").order("created_at", { ascending: false }),
  ]);
  const members = (memberResult.data ?? []).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return { userId: row.user_id, fullName: profile?.full_name ?? "Team member", role: row.role, status: row.status };
  });
  const invitations = (invitationResult.data ?? []).map((row) => ({ id: row.id, email: row.email, status: row.status, expiresAt: row.expires_at }));

  return <DashboardShell><div className="space-y-5"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">Agency administration</p><h2 className="mt-2 text-2xl font-semibold">Team access</h2></div><TeamManager organizationId={ownMembership.organization_id} members={members} invitations={invitations} /></div></DashboardShell>;
}
