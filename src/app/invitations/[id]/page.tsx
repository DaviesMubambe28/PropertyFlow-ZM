import { AccountPanel } from "@/components/account-panel";
import { redirect } from "next/navigation";
import { acceptInvitation } from "@/actions/team";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function InvitationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect(`/login?next=${encodeURIComponent(`/invitations/${id}`)}`);
  return <AccountPanel><p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">Agency invitation</p><h1 className="mt-3 text-3xl font-semibold">Join the agency workspace</h1><p className="mt-3 text-sm leading-6 text-muted-ink">Acceptance succeeds only when this invitation is pending, unexpired, and matches your signed-in email address.</p>{error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">This invitation is unavailable, expired, revoked, or belongs to another email address.</p>}<form action={acceptInvitation} className="mt-6"><input type="hidden" name="invitationId" value={id} /><button className="brand-button-primary min-h-12 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white">Accept invitation</button></form></AccountPanel>;
}
