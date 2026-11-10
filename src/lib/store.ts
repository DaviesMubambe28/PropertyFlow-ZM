import { AppState, Organization, Property, SubscriptionPlan, User } from "@/lib/types";

export const STORAGE_KEY = "propertyflow-zm-demo-store";

const defaultPlans: SubscriptionPlan[] = [
  {
    id: "agent-solo",
    name: "Agent Solo",
    price: 249,
    seats: 1,
    listings: 25,
    description: "For independent agents working a focused portfolio.",
    enabled: true,
  },
  {
    id: "agency-team",
    name: "Agency Team",
    price: 799,
    seats: 8,
    listings: 200,
    description: "Built for collaborative sales teams and agencies.",
    enabled: true,
  },
  {
    id: "agency-business",
    name: "Agency Business",
    price: 1499,
    seats: 20,
    listings: 500,
    description: "Enterprise-grade workspace for growing property businesses.",
    enabled: true,
  },
  {
    id: "landlord-basic",
    name: "Landlord Basic",
    price: 0,
    seats: 4,
    listings: 0,
    description: "Development-ready landlord module, disabled until launched.",
    enabled: false,
  },
];

export function generateId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(16)}`;
}

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
      password: "demo123",
      role: "owner",
      createdAt: now,
      orgId: "org-lusaka-heights",
    },
    {
      id: "user-njovu",
      fullName: "Njovu Banda",
      email: "njovu@mwebantuhomes.co.zm",
      password: "demo123",
      role: "agent",
      createdAt: now,
      orgId: "org-mwebantu-homes",
    },
    {
      id: "user-lwazi",
      fullName: "Lwazi Mwewa",
      email: "lwazi@nkwazi.co.zm",
      password: "demo123",
      role: "landlord",
      createdAt: now,
      orgId: "org-nkwazi-landlord",
    },
  ];

  const properties: Property[] = [
    {
      id: "prop-1",
      orgId: "org-lusaka-heights",
      title: "Mapepe Family House",
      type: "Residential house",
      listingType: "sale",
      price: 780000,
      location: "Kabulonga, Lusaka",
      bedrooms: 4,
      bathrooms: 3,
      area: 275,
      status: "active",
      imageUrl:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      description: "Modern four-bedroom family residence with a landscaped garden.",
      featured: true,
      createdAt: now,
    },
    {
      id: "prop-2",
      orgId: "org-lusaka-heights",
      title: "Greenview Commercial Office",
      type: "Office space",
      listingType: "rent",
      price: 6800,
      location: "Leopards Hill, Lusaka",
      bedrooms: 0,
      bathrooms: 2,
      area: 180,
      status: "active",
      imageUrl:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      description: "Open-plan office with covered parking and reception area.",
      featured: false,
      createdAt: now,
    },
    {
      id: "prop-3",
      orgId: "org-mwebantu-homes",
      title: "Lake Road Apartment",
      type: "Apartment",
      listingType: "rent",
      price: 4200,
      location: "Chilenje, Lusaka",
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      status: "active",
      imageUrl:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      description: "Two-bedroom apartment with balcony and secure access.",
      featured: true,
      createdAt: now,
    },
  ];

  return {
    organizations,
    users,
    properties,
    contacts: [],
    leads: [],
    viewings: [],
    tasks: [],
    deals: [],
    subscriptionPlans: defaultPlans,
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

export function saveAppState(state: AppState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function getPlanById(plans: SubscriptionPlan[], planId: string) {
  return plans.find((plan) => plan.id === planId);
}
