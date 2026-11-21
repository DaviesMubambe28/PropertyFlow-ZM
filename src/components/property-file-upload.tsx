"use client";

import { useActionState } from "react";
import { uploadPropertyFile } from "@/actions/property-files";

export function PropertyFileUpload({ propertyId }: { propertyId: string }) {
  const [message, action, pending] = useActionState(uploadPropertyFile, "");
  return (
    <form action={action} className="space-y-3 rounded-lg border border-line bg-white p-5">
      <input type="hidden" name="propertyId" value={propertyId} />
      <label className="block text-sm font-semibold">Choose a private file
        <input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" required className="mt-2 block w-full rounded-lg border border-line p-2 font-normal" />
      </label>
      <p className="text-sm text-quiet">PDF, JPEG, PNG or WebP, up to 750 KiB. Property files are shared only with team members who can access the property.</p>
      <button className="brand-button-primary min-h-11 rounded-lg px-4 text-sm font-semibold disabled:opacity-60" disabled={pending}>
        {pending ? "Uploading…" : "Upload file"}
      </button>
      {message && <p role="status" className="text-sm">{message}</p>}
    </form>
  );
}
