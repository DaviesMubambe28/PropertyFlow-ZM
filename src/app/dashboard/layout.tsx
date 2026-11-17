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
  return <AppProvider identity={identity}>{children}</AppProvider>;
}
