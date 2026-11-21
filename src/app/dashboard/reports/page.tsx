import { AgencyReports } from "@/components/agency-reports";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("agency_branches").select("id,name,organization_id").order("name");
  return <AgencyReports branches={data ?? []} />;
}
