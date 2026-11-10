"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { generateId, loadAppState, saveAppState } from "@/lib/store";
import { getActiveOrganization, getCurrentUser } from "@/lib/tenant";
import type {
  AppState,
  Contact,
  Deal,
  Lead,
  LeadStage,
  Organization,
  OrgType,
  Property,
  TaskItem,
  User,
  Viewing,
} from "@/lib/types";

interface AppContextValue {
  state: AppState;
  currentUser: User | null;
  activeOrg: ReturnType<typeof getActiveOrganization>;
  signIn: (email: string, password: string) => string | null;
  registerUser: (fullName: string, email: string, password: string, orgName: string, orgType: OrgType) => string | null;
  signOut: () => void;
  switchOrganization: (orgId: string) => void;
  createProperty: (input: Omit<Property, "id" | "orgId" | "createdAt">) => Property | null;
  createContact: (input: Omit<Contact, "id" | "orgId" | "createdAt">) => Contact | null;
  createLead: (input: Omit<Lead, "id" | "orgId" | "createdAt" | "updatedAt">) => Lead | null;
  updateLeadStage: (leadId: string, stage: LeadStage) => void;
  createViewing: (input: { leadId: string; propertyId: string; date: string; notes: string }) => void;
  createTask: (input: Omit<TaskItem, "id" | "orgId" | "createdAt">) => TaskItem | null;
  createDeal: (input: Omit<Deal, "id" | "orgId" | "createdAt">) => Deal | null;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadAppState());

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const currentUser = useMemo(() => getCurrentUser(state), [state]);
  const activeOrg = useMemo(() => getActiveOrganization(state), [state]);

  const signIn = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = state.users.find(
      (user) => user.email.toLowerCase() === normalizedEmail && user.password === password,
    );

    if (!foundUser) {
      return "The email or password did not match a local demo account.";
    }

    setState((previous) => ({
      ...previous,
      currentUserId: foundUser.id,
      activeOrgId: foundUser.orgId,
    }));
    return null;
  };

  const registerUser = (fullName: string, email: string, password: string, orgName: string, orgType: OrgType) => {
    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = state.users.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (duplicate) {
      return "An account with that email already exists.";
    }

    const orgId = generateId("org");
    const userId = generateId("user");
    const now = new Date().toISOString();

    const plan = orgType === "agency"
      ? { id: "agency-team", listingLimit: 200, seatLimit: 8 }
      : orgType === "landlord"
        ? { id: "landlord-basic", listingLimit: 0, seatLimit: 4 }
        : { id: "agent-solo", listingLimit: 25, seatLimit: 1 };
    const org: Organization = {
      id: orgId,
      name: orgName.trim() || `${fullName.trim()}'s workspace`,
      type: orgType,
      contactEmail: normalizedEmail,
      phone: "",
      timezone: "Africa/Lusaka",
      currency: "ZMW",
      subscriptionPlanId: plan.id,
      subscriptionStatus: orgType === "landlord" ? "pending" : "trial",
      createdAt: now,
      listingLimit: plan.listingLimit,
      seatLimit: plan.seatLimit,
    };

    const user: User = {
      id: userId,
      fullName,
      email: normalizedEmail,
      password,
      role: orgType === "agency" ? "owner" : orgType === "landlord" ? "landlord" : "agent",
      createdAt: now,
      orgId,
    };

    setState((previous) => ({
      ...previous,
      organizations: [...previous.organizations, org],
      users: [...previous.users, user],
      currentUserId: user.id,
      activeOrgId: org.id,
    }));

    return null;
  };

  const signOut = () => {
    setState((previous) => ({
      ...previous,
      currentUserId: null,
      activeOrgId: previous.organizations[0]?.id ?? null,
    }));
  };

  const switchOrganization = (orgId: string) => {
    setState((previous) => ({
      ...previous,
      activeOrgId: orgId,
    }));
  };

  const createProperty = (input: Omit<Property, "id" | "orgId" | "createdAt">) => {
    if (!currentUser || !activeOrg) {
      return null;
    }

    const property: Property = {
      ...input,
      id: generateId("prop"),
      orgId: activeOrg.id,
      createdAt: new Date().toISOString(),
    };

    setState((previous) => ({
      ...previous,
      properties: [property, ...previous.properties],
    }));

    return property;
  };

  const createContact = (input: Omit<Contact, "id" | "orgId" | "createdAt">) => {
    if (!currentUser || !activeOrg) {
      return null;
    }

    const contact: Contact = {
      ...input,
      id: generateId("contact"),
      orgId: activeOrg.id,
      createdAt: new Date().toISOString(),
    };

    setState((previous) => ({
      ...previous,
      contacts: [contact, ...previous.contacts],
    }));

    return contact;
  };

  const createLead = (input: Omit<Lead, "id" | "orgId" | "createdAt" | "updatedAt">) => {
    if (!currentUser || !activeOrg) {
      return null;
    }

    const lead: Lead = {
      ...input,
      id: generateId("lead"),
      orgId: activeOrg.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState((previous) => ({
      ...previous,
      leads: [lead, ...previous.leads],
    }));

    return lead;
  };

  const updateLeadStage = (leadId: string, stage: LeadStage) => {
    setState((previous) => ({
      ...previous,
      leads: previous.leads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              stage,
              updatedAt: new Date().toISOString(),
            }
          : lead,
      ),
    }));
  };

  const createViewing = (input: { leadId: string; propertyId: string; date: string; notes: string }) => {
    if (!currentUser || !activeOrg) {
      return;
    }

    const viewing: Viewing = {
      id: generateId("viewing"),
      orgId: activeOrg.id,
      leadId: input.leadId,
      propertyId: input.propertyId,
      date: input.date,
      agentId: currentUser.id,
      status: "scheduled",
      notes: input.notes,
    };

    setState((previous) => ({
      ...previous,
      viewings: [...previous.viewings, viewing],
    }));
  };

  const createTask = (input: Omit<TaskItem, "id" | "orgId" | "createdAt">) => {
    if (!currentUser || !activeOrg) {
      return null;
    }

    const task: TaskItem = {
      ...input,
      id: generateId("task"),
      orgId: activeOrg.id,
      createdAt: new Date().toISOString(),
    };

    setState((previous) => ({
      ...previous,
      tasks: [task, ...previous.tasks],
    }));

    return task;
  };

  const createDeal = (input: Omit<Deal, "id" | "orgId" | "createdAt">) => {
    if (!currentUser || !activeOrg) {
      return null;
    }

    const deal: Deal = {
      ...input,
      id: generateId("deal"),
      orgId: activeOrg.id,
      createdAt: new Date().toISOString(),
    };

    setState((previous) => ({
      ...previous,
      deals: [deal, ...previous.deals],
    }));

    return deal;
  };

  return (
    <AppContext.Provider
      value={{
        state,
        currentUser,
        activeOrg,
        signIn,
        registerUser,
        signOut,
        switchOrganization,
        createProperty,
        createContact,
        createLead,
        updateLeadStage,
        createViewing,
        createTask,
        createDeal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
