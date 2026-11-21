"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { exchangeInvitationSession } from "@/actions/team";

export function InvitationVerification({ invitationPath }: { invitationPath: string }) {
  const router = useRouter();
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    window.history.replaceState(null, "", window.location.pathname);
    const access = fragment.get("access_token");
    const refresh = fragment.get("refresh_token");

    async function verify() {
      try {
        if (fragment.get("type") === "invite" && access && refresh &&
            await exchangeInvitationSession(access, refresh)) {
          router.replace(invitationPath);
          return;
        }
      } catch {
        // A provider or network error can be retried using a new invitation.
      }
      setFailed(true);
    }

    void verify();
  }, [invitationPath, router]);

  return failed
    ? <div className="mt-4 space-y-4">
        <p role="alert" className="text-sm leading-6 text-red-800">This email link is invalid or expired. Sign in with your invited email address or ask your administrator for a new invitation.</p>
        <Link className="brand-button-primary inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold" href={`/login?next=${encodeURIComponent(invitationPath)}`}>Sign in</Link>
      </div>
    : <p role="status" className="mt-4 text-sm text-muted-ink">Checking your invitation…</p>;
}
