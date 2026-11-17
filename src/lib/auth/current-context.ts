import "server-only";

import type { User } from "@supabase/supabase-js";
import type { AuthenticatedIdentity } from "@/components/app-provider";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type MembershipRow = {
  organization_id: string;
  role: "admin" | "agent";
  organizations: unknown;
};

type OrganizationRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  timezone: string;
  currency: string;
  created_at: string;
};

function isOrganizationRow(value: unknown): value is OrganizationRow {
  return Boolean(value && typeof value === "object" && "id" in value && "name" in value && "email" in value);
}

export function mapWorkspaceIdentity(user: User, rows: MembershipRow[]): AuthenticatedIdentity | null {
  const memberships = rows.flatMap((membership) => {
    const value = Array.isArray(membership.organizations) ? membership.organizations[0] : membership.organizations;
    return isOrganizationRow(value) ? [{ membership, organization: value }] : [];
  });
  if (!memberships.length || !user.email) return null;
  const primary = memberships[0];
  return {
    user: {
      id: user.id,
      fullName: String(user.user_metadata.full_name ?? user.email.split("@")[0]),
      email: user.email,
      role: primary.membership.role === "admin" ? "owner" : "agent",
      createdAt: user.created_at,
      orgId: primary.organization.id,
    },
    organizations: memberships.map(({ organization }) => ({
      id: organization.id,
      name: organization.name,
      type: "agency",
      contactEmail: organization.email,
      phone: organization.phone ?? "",
      timezone: organization.timezone,
      currency: organization.currency,
      subscriptionPlanId: "agency-team",
      subscriptionStatus: "trial",
      createdAt: organization.created_at,
      listingLimit: 200,
      seatLimit: 8,
    })),
  };
}

export async function loadWorkspaceIdentity(supabase: SupabaseServerClient, user: User) {
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("organization_id, role, organizations!inner(id, name, email, phone, timezone, currency, created_at)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at");
  if (error) throw new Error("Unable to load the authenticated workspace.");
  return mapWorkspaceIdentity(user, (data ?? []) as MembershipRow[]);
}
