import { DashboardShell } from "@/components/dashboard-shell";
import { CsvImport } from "@/components/csv-import";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function ImportPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data: membership } = await supabase.from("organization_memberships")
    .select("organization_id,role").eq("user_id", auth.user.id).eq("status", "active")
    .order("created_at").limit(1).maybeSingle();

  return (
    <DashboardShell>
      <section className="max-w-4xl rounded-lg border border-line bg-white p-6">
        <h2 className="text-2xl font-semibold text-deep">Import agency records</h2>
        {membership?.role === "admin"
          ? <CsvImport organizationId={membership.organization_id} />
          : <p className="mt-3 text-quiet">Only an agency administrator can import records.</p>}
      </section>
    </DashboardShell>
  );
}
