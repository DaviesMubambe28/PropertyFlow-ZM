import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { DemoReviewForm } from "@/components/demo-review-form";
import { getDemoStaff } from "@/lib/auth/demo-staff";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;
export const metadata: Metadata = { title: "Demo requests", robots: { index: false, follow: false } };

const dateFormat = new Intl.DateTimeFormat("en-ZM", {
  timeZone: "Africa/Lusaka", dateStyle: "medium", timeStyle: "short",
});

export default async function DemoRequestsPage({ searchParams }: PageProps<"/staff/demo-requests">) {
  const staff = await getDemoStaff();
  if (!staff) {
    const { createClient } = await import("@/lib/supabase/server");
    const { data } = await (await createClient()).auth.getUser();
    if (!data.user) redirect("/login?next=%2Fstaff%2Fdemo-requests");
    notFound();
  }

  const { page } = await searchParams;
  const number = typeof page === "string" && /^\d{1,5}$/.test(page) ? Math.max(1, Number(page)) : 1;
  const start = (number - 1) * 20;
  const { data, error } = await createAdminClient().from("enterprise_demo_requests")
    .select("*, enterprise_demo_history(id, note, status, created_at)")
    .order("created_at", { ascending: false }).order("id", { ascending: false })
    .order("id", { ascending: false, referencedTable: "enterprise_demo_history" })
    .range(start, start + 20);

  return <>
    <SiteHeader />
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Enterprise demo requests</h1>
      {error && <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">Requests could not be loaded. Refresh to try again.</p>}
      {data?.length === 0 && <p className="mt-6 text-slate-600">No requests on this page.</p>}
      <div className="mt-6 space-y-5">
        {data?.slice(0, 20).map((request) => (
          <article key={request.id} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
            <p className="text-xs font-medium text-slate-600">{dateFormat.format(new Date(request.created_at))} · {request.team_size} team members</p>
            <h2 className="mt-2 break-words text-xl font-semibold">{request.company}</h2>
            <p className="mt-1 break-words text-sm">{request.full_name} · {request.email}{request.phone && ` · ${request.phone}`}</p>
            <p className="mt-1 text-sm text-slate-600">{request.assigned_to === staff.id ? "Assigned to you" : request.assigned_to ? "Assigned to staff" : "Unassigned"}</p>
            {request.requirements && <p className="mt-4 whitespace-pre-wrap break-words text-sm">{request.requirements}</p>}
            <DemoReviewForm id={request.id} status={request.status} />
            {request.enterprise_demo_history.length > 0 && <details className="mt-5 border-t border-slate-200 pt-4 text-sm">
              <summary className="cursor-pointer font-medium">Follow-up history</summary>
              <ol className="mt-3 space-y-3">
                {request.enterprise_demo_history.map((entry: { id: number; note: string; status: string; created_at: string }) =>
                  <li key={entry.id} className="break-words"><time dateTime={entry.created_at}>{dateFormat.format(new Date(entry.created_at))}</time> · <span className="capitalize">{entry.status}</span>{entry.note && <p className="mt-1 whitespace-pre-wrap">{entry.note}</p>}</li>
                )}
              </ol>
            </details>}
          </article>
        ))}
      </div>
      <nav aria-label="Demo request pages" className="mt-6 flex gap-5 text-sm font-semibold text-teal-800">
        {number > 1 && <Link href={`?page=${number - 1}`}>Previous page</Link>}
        {data && data.length > 20 && <Link href={`?page=${number + 1}`}>Next page</Link>}
      </nav>
    </main>
  </>;
}
