"use client";

import Link from "next/link";
import { useActionState } from "react";
import { setPropertyPublication } from "@/actions/publication";

export function PublicationControls({ id, available, version }: { id: string; available: boolean; version: string }) {
  const [message, action, pending] = useActionState(setPropertyPublication, null);
  return (
    <details className="mt-3 border-t border-line pt-3 text-sm">
      <summary className="cursor-pointer font-semibold text-brand">Public listing</summary>
      <p className="my-3 text-quiet">Publishing shares the listing title, location, description, property details, price and photo. Review those fields for private information first. Changes to public details withdraw the listing for review.</p>
      <form action={action} className="flex flex-wrap gap-2">
        <input type="hidden" name="propertyId" value={id} />
        <input type="hidden" name="version" value={version} />
        {available && (
          <button type="submit" name="decision" value="publish" disabled={pending} className="brand-button-primary min-h-11 rounded-lg px-3 font-semibold disabled:opacity-60">Publish</button>
        )}
        <button type="submit" name="decision" value="withdraw" disabled={pending} className="brand-button-secondary min-h-11 rounded-lg px-3 font-semibold disabled:opacity-60">Withdraw</button>
      </form>
      {message && <p className="mt-2 text-quiet" role="status">{message}</p>}
      {message === "Listing published." && (
        <Link href={`/properties/${id}`} className="mt-2 inline-block font-semibold text-brand underline">View public listing</Link>
      )}
    </details>
  );
}
