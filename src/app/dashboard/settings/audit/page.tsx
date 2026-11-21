import { DashboardShell } from "@/components/dashboard-shell";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

const timestamp = new Intl.DateTimeFormat("en-ZM", { timeZone: "Africa/Lusaka", dateStyle: "medium", timeStyle: "short" });

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data: membership } = await supabase.from("organization_memberships")
    .select("organization_id,role").eq("user_id", auth.user.id).eq("status", "active").order("created_at").limit(1).maybeSingle();
  if (membership?.role !== "admin") return <DashboardShell><p>Only agency administrators can view access history.</p></DashboardShell>;

  const { data: events, error } = await supabase.from("agency_access_events")
    .select("id,actor_id,subject_id,action,detail,created_at")
    .eq("organization_id", membership.organization_id).order("created_at", { ascending: false }).limit(100);
  return (
    <DashboardShell>
      <section className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-2xl font-semibold">Agency access history</h2>
        <p className="mt-2 text-sm text-quiet">The latest 100 changes to agency roles, branch access and property assignments.</p>
        {error && <p className="mt-4" role="alert">Access history is temporarily unavailable.</p>}
        {events?.length === 0 && <p className="mt-4 text-sm text-quiet">There are no access changes to show.</p>}
        <ul className="mt-4 divide-y divide-line">
          {events?.map((event) => (
            <li key={event.id} className="space-y-1 py-3 text-sm">
              <p className="font-semibold">{event.action}</p>
              <p className="break-words text-quiet">{timestamp.format(new Date(event.created_at))} · {event.detail}</p>
              <p className="break-all text-xs text-quiet">Actor {event.actor_id ?? "System"} · Record {event.subject_id}</p>
            </li>
          ))}
        </ul>
      </section>
    </DashboardShell>
  );
}
