import { BranchSettings } from "@/components/branch-settings";
import { DashboardShell } from "@/components/dashboard-shell";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function BranchesPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: own } = await supabase.from("organization_memberships")
    .select("organization_id,role").eq("user_id", auth.user.id).eq("status", "active")
    .order("created_at").limit(1).maybeSingle();
  if (own?.role !== "admin") return <DashboardShell><p>Only an agency administrator can manage branches.</p></DashboardShell>;

  const organizationId = own.organization_id;
  const [branches, memberships, staff, properties] = await Promise.all([
    supabase.from("agency_branches").select("id,name,city").eq("organization_id", organizationId).order("name"),
    supabase.from("agency_branch_members").select("branch_id,user_id,role").eq("organization_id", organizationId),
    supabase.from("organization_memberships").select("user_id,profiles!organization_memberships_user_id_fkey(full_name)")
      .eq("organization_id", organizationId).eq("status", "active"),
    supabase.from("properties").select("id,title,branch_id,status").eq("organization_id", organizationId).order("title"),
  ]);
  if (branches.error || memberships.error || staff.error || properties.error) {
    return <DashboardShell><p role="alert">Branch settings are temporarily unavailable.</p></DashboardShell>;
  }

  return (
    <DashboardShell>
      <BranchSettings
        organizationId={organizationId}
        branches={branches.data}
        memberships={memberships.data}
        staff={staff.data.map((member) => {
          const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
          return { id: member.user_id, name: profile?.full_name ?? "Team member" };
        })}
        properties={properties.data}
      />
    </DashboardShell>
  );
}
