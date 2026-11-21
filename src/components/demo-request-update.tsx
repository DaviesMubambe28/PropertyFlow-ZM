"use client";

import { useActionState } from "react";
import { updateDemoRequest } from "@/actions/demo";
import { demoStatuses } from "@/lib/validation/demo";

export function DemoRequestUpdate({ id, status }: { id: string; status: string }) {
  const [result, action, pending] = useActionState(updateDemoRequest, null);
  return (
    <form action={action} className="mt-5 grid gap-3 border-t border-slate-200 pt-5">
      <input type="hidden" name="id" value={id} />
      <label className="text-sm font-medium">Status
        <select name="status" defaultValue={status} className="ml-3 rounded-lg border border-slate-300 p-2 capitalize">
          {demoStatuses.map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium">Follow-up note
        <textarea name="note" rows={2} maxLength={2000} className="mt-1 block w-full rounded-lg border border-slate-300 p-2" />
      </label>
      <button disabled={pending} className="brand-button-primary w-fit rounded-lg px-4 py-2 text-white disabled:opacity-60">
        {pending ? "Saving…" : "Save update"}
      </button>
      {result && <p role="status" className="text-sm">{result}</p>}
    </form>
  );
}
