import { AppState, Organization, User } from "@/lib/types";

export function getCurrentUser(state: AppState): User | null {
  if (!state.currentUserId) {
    return null;
  }

  return state.users.find((user) => user.id === state.currentUserId) ?? null;
}

export function getActiveOrganization(state: AppState): Organization | null {
  if (!state.activeOrgId) {
    return null;
  }

  return state.organizations.find((organization) => organization.id === state.activeOrgId) ?? null;
}

export function getUserOrganizations(state: AppState, userId: string) {
  const user = state.users.find((entry) => entry.id === userId);
  if (!user) {
    return [];
  }

  return state.organizations.filter((org) => org.id === user.orgId);
}

export function canAccessOrganization(state: AppState, user: User | null, orgId: string) {
  if (!user) {
    return false;
  }

  return user.orgId === orgId;
}

export function formatCurrency(value: number, currency = "ZMW") {
  return new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function toRelativeLink(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}
