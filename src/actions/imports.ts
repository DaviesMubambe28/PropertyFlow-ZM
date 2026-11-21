"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { importKinds, maxImportRows, validateImportRows } from "@/lib/csv-import";
import { createClient } from "@/lib/supabase/server";

const inputSchema = z.object({
  organizationId: z.uuid(),
  kind: importKinds,
  rows: z.array(z.unknown()).min(1).max(maxImportRows),
});

export async function importAgencyCsv(input: unknown) {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { error: "Choose a valid agency and import file." };
  const { kind, rows, organizationId } = parsed.data;
  const validated = validateImportRows(kind, rows);
  if (validated.some((item) => item.error)) return { error: "Correct the invalid rows before importing." };
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return { error: "Sign in again to import records." };
  const { data, error } = await supabase.rpc("import_agency_records", {
    workspace: organizationId, record_kind: kind, records: validated.map((item) => item.data),
  });
  if (error || typeof data !== "number") return { error: "The import was not saved. Check administrator access and try again." };
  revalidatePath("/dashboard", "layout");
  return { inserted: data, duplicates: rows.length - data };
}
