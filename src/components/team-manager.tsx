"use client";

import { useActionState } from "react";
import Link from "next/link";
import { inviteAgent, revokeInvitation, setMembershipRole, setMembershipStatus } from "@/actions/team";

type Member = { userId: string; fullName: string; role: string; status: string };
type Invitation = { id: string; email: string; status: string; expiresAt: string };

export function TeamManager({ organizationId, members, invitations, currentUserId }: { currentUserId: string; organizationId: string; members: Member[]; invitations: Invitation[] }) {
  const [state, action, pending] = useActionState(inviteAgent, { status: "idle" as const });
  return <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold">Invite an agent</h2>
      <p className="mt-2 text-sm leading-6 text-quiet">The invitation is limited to the entered email and expires after seven days.</p>
      <form action={action} className="mt-5 space-y-4">
        <input type="hidden" name="organizationId" value={organizationId} />
        <label className="block text-sm font-medium">Agent email<input name="email" type="email" autoComplete="email" required className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3.5 py-3" /></label>
        {state.message && <p role={state.status === "error" ? "alert" : "status"} className="text-sm text-quiet">{state.message}</p>}
        {state.invitePath && <Link href={state.invitePath} className="block break-all rounded-xl bg-[#F1FAFA] p-3 text-sm font-medium text-brand">Open shareable invitation: {state.invitePath}</Link>}
        <button disabled={pending} className="brand-button-primary min-h-11 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Creating…" : "Create invitation"}</button>
      </form>
      <div className="mt-7 border-t border-line pt-5">
        <h3 className="font-semibold">Pending invitations</h3>
        <div className="mt-3 space-y-2">
          {invitations.map((invitation) => <div key={invitation.id} className="rounded-xl border border-line p-3 text-sm">
            <p className="break-all font-medium">{invitation.email}</p>
            <p className="mt-1 text-xs text-quiet">Expires {new Date(invitation.expiresAt).toLocaleDateString("en-ZM")}</p>
            <div className="mt-3 flex gap-3"><Link href={`/invitations/${invitation.id}`} className="text-xs font-semibold text-brand">Open link</Link><form action={revokeInvitation}><input type="hidden" name="invitationId" value={invitation.id} /><button className="text-xs font-semibold text-[#B42318]">Revoke</button></form></div>
          </div>)}
          {invitations.length === 0 && <p className="text-sm text-quiet">No pending invitations.</p>}
        </div>
      </div>
    </section>

    <section className="rounded-lg border border-line bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold">Team members</h2>
      <div className="mt-5 divide-y divide-line">
        {members.map((member) => <div key={member.userId} className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div><p className="font-medium">{member.fullName}</p><p className="mt-1 text-xs uppercase tracking-wide text-quiet">{member.role} · {member.status}</p></div>
          <div className="flex flex-wrap gap-2">
          {member.status === "active" && member.userId !== currentUserId && <RoleEditor organizationId={organizationId} member={member} />}
          {member.role === "agent" && <form action={setMembershipStatus}>
            <input type="hidden" name="organizationId" value={organizationId} /><input type="hidden" name="userId" value={member.userId} />
            <input type="hidden" name="status" value={member.status === "active" ? "deactivated" : "active"} />
            <button className="rounded-lg border border-line px-3 py-2 text-xs font-semibold text-quiet">{member.status === "active" ? "Deactivate" : "Reactivate"}</button>
          </form>}
          </div>
        </div>)}
      </div>
    </section>
  </div>;
}


function RoleEditor({ organizationId, member }: { organizationId: string; member: Member }) {
  const [result, action, pending] = useActionState(setMembershipRole, "");
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="organizationId" value={organizationId} />
      <input type="hidden" name="userId" value={member.userId} />
      <select name="role" defaultValue={member.role} aria-label={`Role for ${member.fullName}`} className="rounded-lg border border-line p-2 text-xs">
        <option value="agent">Agent</option><option value="admin">Administrator</option>
      </select>
      <button className="rounded-lg border border-line px-3 py-2 text-xs font-semibold" disabled={pending}>{pending ? "Saving…" : "Save role"}</button>
      {result && <p role="status" className="w-full text-xs text-quiet">{result}</p>}
    </form>
  );
}
