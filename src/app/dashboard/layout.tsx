import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login?next=%2Fdashboard");
  return children;
}
