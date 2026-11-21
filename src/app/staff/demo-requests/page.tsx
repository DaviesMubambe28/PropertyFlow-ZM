import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoRequestUpdate } from "@/components/demo-request-update";
import { SiteHeader } from "@/components/site-header";
import { getSalesStaffId } from "@/lib/auth/sales-staff";
import { createAdminClient } from "@/lib/supabase/admin";
import { demoStatuses } from "@/lib/validation/demo";

export const metadata: Metadata = { title: "Demo requests | PropertyFlow ZM", robots: { index: false } };
export const instant = false;

const dateFormat = new Intl.DateTimeFormat("en-ZM", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lusaka",
});

type Activity = { id: string; created_at: string; status: string; note: string };
type Search = { q?: string; status?: string };

export default async function DemoRequestsPage({ searchParams }: { searchParams: Promise<Search> }) {
  if (!(await getSalesStaffId())) notFound();
  const filters = await searchParams;
  const status = demoStatuses.find((option) => option === filters.status);
  const query = typeof filters.q === "string" ? filters.q.trim().slice(0, 120) : "";

  let requests = createAdminClient().from("demo_requests")
    .select("id, name, company, email, phone, team_size, message, status, created_at, demo_request_activity(id, created_at, status, note)")
    .order("created_at", { ascending: false }).limit(100);
  if (status) requests = requests.eq("status", status);
  if (query) {
    const pattern = `"%${query.replace(/[\\%_"*]/g, "\\$&")}%"`;
    requests = requests.or(`company.ilike.${pattern},name.ilike.${pattern},email.ilike.${pattern}`);
  }
  const { data, error } = await requests;
  return (
    <>
      <SiteHeader />
      <main className="site-width py-12">
        <h1 className="text-3xl font-black tracking-tight text-brand sm:text-4xl">Demo requests</h1>
        <p className="mt-2 text-slate-600">View and follow up on the latest 100 matching enquiries.</p>
        <form className="my-6 flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm font-medium">Name, company or email
            <input name="q" type="search" maxLength={120} defaultValue={query} className="rounded-lg border border-slate-300 bg-white p-2" />
          </label>
          <label className="grid gap-1 text-sm font-medium">Status
            <select name="status" defaultValue={status ?? ""} className="rounded-lg border border-slate-300 bg-white p-2 capitalize">
              <option value="">All statuses</option>
              {demoStatuses.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <button className="brand-button-primary rounded-lg px-4 py-2 text-white">Apply filters</button>
        </form>
        {error && <p role="alert">Demo requests could not be loaded. Please try again.</p>}
        {data?.length === 0 && <p>No requests match these filters.</p>}
        <div className="grid gap-4">
          {data?.map((request) => (
            <article className="rounded-2xl border border-line bg-white p-5" key={request.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">{request.company}</h2>
                <span className="rounded-full bg-tint px-3 py-1 text-sm capitalize text-deep">{request.status}</span>
              </div>
              <p className="mt-2 break-words text-sm">{request.name} · {request.email} {request.phone && `· ${request.phone}`}</p>
              <p className="mt-1 text-sm text-slate-600">Team of {request.team_size} · {dateFormat.format(new Date(request.created_at))}</p>
              {request.message && <p className="mt-3 whitespace-pre-wrap break-words">{request.message}</p>}
              <DemoRequestUpdate key={request.status} id={request.id} status={request.status} />
              {request.demo_request_activity.length > 0 && (
                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer font-medium">Follow-up history</summary>
                  <ul className="mt-2 space-y-2">
                    {[...request.demo_request_activity].sort((a, b) => b.created_at.localeCompare(a.created_at)).map((item: Activity) => (
                      <li key={item.id} className="whitespace-pre-wrap break-words">{dateFormat.format(new Date(item.created_at))} · {item.status}{item.note && ` · ${item.note}`}</li>
                    ))}
                  </ul>
                </details>
              )}
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
