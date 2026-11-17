import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadWorkspaceIdentity } from "@/lib/auth/current-context";
import { AppProvider } from "@/components/app-provider";

export const instant = false;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login?next=%2Fdashboard");
  const identity = await loadWorkspaceIdentity(supabase, data.user);
  if (!identity) redirect("/register?error=workspace_missing");
  const workspaceVersion = JSON.stringify({
    properties: identity.data?.properties.map((item) => item.id),
    contacts: identity.data?.contacts.map((item) => item.id),
    leads: identity.data?.leads.map((item) => `${item.id}:${item.updatedAt}`),
    viewings: identity.data?.viewings.map((item) => `${item.id}:${item.status}`),
    tasks: identity.data?.tasks.map((item) => `${item.id}:${item.status}`),
    deals: identity.data?.deals.map((item) => `${item.id}:${item.status}`),
  });
  return <AppProvider key={workspaceVersion} identity={identity}>{children}</AppProvider>;
}
