import "server-only";

import type { User } from "@supabase/supabase-js";
import type { AuthenticatedIdentity } from "@/components/app-provider";
import type { createClient } from "@/lib/supabase/server";
import type { AppState } from "@/lib/types";

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
  location?: string | null;
  logo_url?: string | null;
  timezone: string;
  currency: string;
  created_at: string;
};

function isOrganizationRow(value: unknown): value is OrganizationRow {
  return Boolean(value && typeof value === "object" && "id" in value && "name" in value && "email" in value);
}

type OperationalRows = {
  properties: Record<string, unknown>[];
  contacts: Record<string, unknown>[];
  leads: Record<string, unknown>[];
  viewings: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  deals: Record<string, unknown>[];
};

export function mapOperationalData(rows: OperationalRows): NonNullable<AuthenticatedIdentity["data"]> {
  return {
    properties: rows.properties.map((row) => ({
      id: String(row.id), orgId: String(row.organization_id), title: String(row.title), type: String(row.type),
      listingType: row.listing_type as "sale" | "rent", price: Number(row.price), location: String(row.location),
      bedrooms: Number(row.bedrooms), bathrooms: Number(row.bathrooms), area: Number(row.area),
      status: row.status as AppState["properties"][number]["status"], imageUrl: String(row.image_url ?? ""),
      description: String(row.description), featured: Boolean(row.featured), createdAt: String(row.created_at),
    })),
    contacts: rows.contacts.map((row) => ({
      id: String(row.id), orgId: String(row.organization_id), name: String(row.name), email: String(row.email),
      phone: String(row.phone), category: String(row.category), leadSource: String(row.lead_source),
      budget: String(row.budget), notes: String(row.notes), createdAt: String(row.created_at),
    })),
    leads: rows.leads.map((row) => ({
      id: String(row.id), orgId: String(row.organization_id), contactId: String(row.contact_id),
      propertyId: row.property_id ? String(row.property_id) : undefined, title: String(row.title),
      stage: row.stage as AppState["leads"][number]["stage"], assignedTo: String(row.assigned_to),
      value: Number(row.value), notes: String(row.notes), createdAt: String(row.created_at), updatedAt: String(row.updated_at),
    })),
    viewings: rows.viewings.map((row) => ({
      id: String(row.id), orgId: String(row.organization_id), leadId: String(row.lead_id),
      propertyId: String(row.property_id), date: String(row.scheduled_at), agentId: String(row.agent_id),
      status: row.status as AppState["viewings"][number]["status"], notes: String(row.notes),
    })),
    tasks: rows.tasks.map((row) => ({
      id: String(row.id), orgId: String(row.organization_id), title: String(row.title),
      description: String(row.description), assigneeId: String(row.assignee_id), dueDate: String(row.due_at),
      priority: row.priority as AppState["tasks"][number]["priority"],
      status: row.status as AppState["tasks"][number]["status"], createdAt: String(row.created_at),
    })),
    deals: rows.deals.map((row) => ({
      id: String(row.id), orgId: String(row.organization_id), leadId: String(row.lead_id),
      propertyId: String(row.property_id), clientName: String(row.client_name), amount: Number(row.amount),
      status: row.status as AppState["deals"][number]["status"], assignedTo: String(row.assigned_to),
      notes: String(row.notes), createdAt: String(row.created_at),
      closedAt: row.closed_at ? String(row.closed_at) : undefined,
    })),
  };
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
      location: organization.location ?? "",
      logoUrl: organization.logo_url ?? "",
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
    .select("organization_id, role, organizations!inner(id, name, email, phone, location, logo_url, timezone, currency, created_at)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at");
  if (error) throw new Error("Unable to load the authenticated workspace.");
  const identity = mapWorkspaceIdentity(user, (data ?? []) as MembershipRow[]);
  if (!identity) return null;

  const results = await Promise.all([
    supabase.from("properties").select("*").order("created_at", { ascending: false }),
    supabase.from("contacts").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("viewings").select("*").order("scheduled_at"),
    supabase.from("tasks").select("*").order("due_at"),
    supabase.from("deals").select("*").order("created_at", { ascending: false }),
  ]);
  if (results.some((result) => result.error)) throw new Error("Unable to load workspace records.");
  identity.data = mapOperationalData({
    properties: (results[0].data ?? []) as Record<string, unknown>[],
    contacts: (results[1].data ?? []) as Record<string, unknown>[],
    leads: (results[2].data ?? []) as Record<string, unknown>[],
    viewings: (results[3].data ?? []) as Record<string, unknown>[],
    tasks: (results[4].data ?? []) as Record<string, unknown>[],
    deals: (results[5].data ?? []) as Record<string, unknown>[],
  });
  return identity;
}
