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
  Property,
  TaskItem,
  User,
  Viewing,
} from "@/lib/types";

interface AppContextValue {
  state: AppState;
  currentUser: User | null;
  activeOrg: ReturnType<typeof getActiveOrganization>;
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
