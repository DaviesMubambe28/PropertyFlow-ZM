"use client";

import { useActionState } from "react";
import { reviewDemoRequest } from "@/actions/demo";
import { demoStatuses } from "@/lib/validation/demo";

export function DemoReviewForm({ id, status }: { id: string; status: string }) {
  const [result, action, pending] = useActionState(reviewDemoRequest, { status: "idle" as const, message: "" });
  return (
    <form action={action} className="mt-5 grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={id} />
      <label className="grid gap-1 text-sm">Status
        <select name="status" defaultValue={status} className="rounded-lg border border-line bg-white p-2 capitalize">
          {demoStatuses.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm">Assignment
        <select name="assignment" className="rounded-lg border border-line bg-white p-2">
          <option value="keep">Keep current assignment</option>
          <option value="self">Assign to me</option>
          <option value="clear">Unassign</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm sm:col-span-2">Follow-up note
        <textarea name="note" maxLength={1500} rows={2} className="rounded-lg border border-line bg-white p-2" />
      </label>
      <button className="brand-button-primary min-h-11 w-fit rounded-lg px-4 text-sm font-semibold disabled:opacity-60" disabled={pending}>
        {pending ? "Saving…" : "Save follow-up"}
      </button>
      <p role={result.status === "error" ? "alert" : "status"} className="text-sm">{result.message}</p>
    </form>
  );
}
