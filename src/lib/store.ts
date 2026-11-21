import { demoProperties } from "@/lib/demo-properties";
import { AppState, Organization, User } from "@/lib/types";

export const STORAGE_KEY = "propertyflow-zm-demo-store";

export function createSeedState(): AppState {
  const now = "2025-01-01T00:00:00.000Z";

  const organizations: Organization[] = [
    {
      id: "org-lusaka-heights",
      name: "Lusaka Heights Realty",
      type: "agency",
      contactEmail: "hello@lusakaheights.co.zm",
      phone: "+260 955 100 200",
      timezone: "Africa/Lusaka",
      currency: "ZMW",
      subscriptionPlanId: "agency-team",
      subscriptionStatus: "active",
      createdAt: now,
      listingLimit: 200,
      seatLimit: 8,
    },
    {
      id: "org-mwebantu-homes",
      name: "Mwebantu Homes",
      type: "independent_agent",
      contactEmail: "jonah@mwebantuhomes.co.zm",
      phone: "+260 977 500 600",
      timezone: "Africa/Lusaka",
      currency: "ZMW",
      subscriptionPlanId: "agent-solo",
      subscriptionStatus: "trial",
      createdAt: now,
      listingLimit: 25,
      seatLimit: 1,
    },
    {
      id: "org-nkwazi-landlord",
      name: "Nkwazi Landlords",
      type: "landlord",
      contactEmail: "landlord@nkwazi.co.zm",
      phone: "+260 966 400 700",
      timezone: "Africa/Lusaka",
      currency: "ZMW",
      subscriptionPlanId: "landlord-basic",
      subscriptionStatus: "pending",
      createdAt: now,
      listingLimit: 0,
      seatLimit: 4,
    },
  ];

  const users: User[] = [
    {
      id: "user-sarah",
      fullName: "Sarah Nkandu",
      email: "sarah@lusakaheights.co.zm",
      role: "owner",
      createdAt: now,
      orgId: "org-lusaka-heights",
    },
    {
      id: "user-njovu",
      fullName: "Njovu Banda",
      email: "njovu@mwebantuhomes.co.zm",
      role: "agent",
      createdAt: now,
      orgId: "org-mwebantu-homes",
    },
    {
      id: "user-lwazi",
      fullName: "Lwazi Mwewa",
      email: "lwazi@nkwazi.co.zm",
      role: "landlord",
      createdAt: now,
      orgId: "org-nkwazi-landlord",
    },
  ];


  return {
    organizations,
    users,
    properties: [...demoProperties],
    contacts: [],
    leads: [],
    viewings: [],
    tasks: [],
    deals: [],
    leadInteractions: [],
    subscriptionPlans: [],
    currentUserId: "user-sarah",
    activeOrgId: "org-lusaka-heights",
  };
}

export function createEmptyState(): AppState {
  return {
    organizations: [],
    users: [],
    properties: [],
    contacts: [],
    leads: [],
    viewings: [],
    tasks: [],
    deals: [],
    leadInteractions: [],
    subscriptionPlans: [],
    currentUserId: null,
    activeOrgId: null,
  };
}

export function loadAppState(): AppState {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "development" ? createSeedState() : createEmptyState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initialState = process.env.NODE_ENV === "development" ? createSeedState() : createEmptyState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  try {
    const storedState = JSON.parse(raw) as AppState;
    if (process.env.NODE_ENV !== "development" && storedState.users.some((user) => user.id === "user-sarah")) {
      const emptyState = createEmptyState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyState));
      return emptyState;
    }

    return storedState;
  } catch {
    const initialState = process.env.NODE_ENV === "development" ? createSeedState() : createEmptyState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }
}

export function clearAppState() {
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
}
