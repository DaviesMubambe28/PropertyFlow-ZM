"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearAppState, createSeedState, loadAppState } from "@/lib/store";
import { getActiveOrganization, getCurrentUser } from "@/lib/tenant";
import type {
  AppState,
  User,
} from "@/lib/types";

interface AppContextValue {
  state: AppState;
  currentUser: User | null;
  activeOrg: ReturnType<typeof getActiveOrganization>;
  switchOrganization: (orgId: string) => void;
}

export type AuthenticatedIdentity = {
  user: User;
  organizations: AppState["organizations"];
  data?: Pick<AppState, "properties" | "contacts" | "leads" | "viewings" | "tasks" | "deals">;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children, identity }: { children: ReactNode; identity?: AuthenticatedIdentity }) {
  const [state, setState] = useState<AppState>(() => {
    const initialState = identity ? createSeedState() : loadAppState();
    if (!identity) return initialState;
    return {
      ...initialState,
      organizations: identity.organizations,
      users: [identity.user],
      ...identity.data,
      currentUserId: identity.user.id,
      activeOrgId: identity.user.orgId,
    };
  });

  useEffect(() => {
    if (identity) clearAppState();
  }, [identity]);

  const currentUser = useMemo(() => getCurrentUser(state), [state]);
  const activeOrg = useMemo(() => getActiveOrganization(state), [state]);

  const switchOrganization = (orgId: string) => {
    setState((previous) => ({
      ...previous,
      activeOrgId: orgId,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        currentUser,
        activeOrg,
        switchOrganization,
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
