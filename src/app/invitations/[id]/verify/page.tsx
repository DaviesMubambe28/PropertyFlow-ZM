import { AccountPanel } from "@/components/account-panel";
import { notFound } from "next/navigation";
import { z } from "zod";
import { InvitationVerification } from "@/components/invitation-verification";

export const instant = false;

export default async function VerifyInvitationPage({ params }: PageProps<"/invitations/[id]/verify">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  return <AccountPanel>
    <h1 className="text-3xl font-semibold tracking-tight">Verify your agency invitation</h1>
    <InvitationVerification invitationPath={`/invitations/${id}`} />
  </AccountPanel>;
}
