"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearAppState, createEmptyState, loadAppState } from "@/lib/store";
import { getActiveOrganization, getCurrentUser } from "@/lib/tenant";
import type {
  AppState,
  User,
} from "@/lib/types";

export type WorkspaceAssignee = { id: string; name: string; organizationId: string };

interface AppContextValue {
  assignees: WorkspaceAssignee[];
  state: AppState;
  currentUser: User | null;
  activeOrg: ReturnType<typeof getActiveOrganization>;
  switchOrganization: (orgId: string) => void;
}

export type AuthenticatedIdentity = {
  user: User;
  organizations: AppState["organizations"];
  assignees?: WorkspaceAssignee[];
  data?: Pick<AppState, "properties" | "contacts" | "leads" | "viewings" | "tasks" | "deals" | "leadInteractions">;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children, identity }: { children: ReactNode; identity?: AuthenticatedIdentity }) {
  const [publicState] = useState<AppState>(() => identity ? createEmptyState() : loadAppState());
  const [selectedOrg, setSelectedOrg] = useState<string>();
  const state = useMemo<AppState>(() => {
    if (!identity) return selectedOrg ? { ...publicState, activeOrgId: selectedOrg } : publicState;
    return {
      ...publicState,
      organizations: identity.organizations,
      users: [identity.user],
      ...identity.data,
      currentUserId: identity.user.id,
      activeOrgId: selectedOrg && identity.organizations.some(({ id }) => id === selectedOrg) ? selectedOrg : identity.user.orgId,
    };
  }, [identity, publicState, selectedOrg]);

  useEffect(() => {
    if (identity) clearAppState();
  }, [identity]);

  const currentUser = useMemo(() => getCurrentUser(state), [state]);
  const activeOrg = useMemo(() => getActiveOrganization(state), [state]);

  return (
    <AppContext.Provider
      value={{
        state,
        assignees: identity?.assignees ?? [],
        currentUser,
        activeOrg,
        switchOrganization: setSelectedOrg,
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
