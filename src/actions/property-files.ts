"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { matchesPropertyFileType, maxPropertyFileBytes, propertyFilesBucket, propertyFileTypes } from "@/lib/property-files";
import { createClient } from "@/lib/supabase/server";

export async function uploadPropertyFile(_previous: string, form: FormData) {
  const property = z.uuid().safeParse(form.get("propertyId"));
  const file = form.get("file");
  if (!property.success || !(file instanceof File) || file.size < 1 || file.size > maxPropertyFileBytes) {
    return "Choose a supported file up to 750 KiB.";
  }

  const extension = propertyFileTypes[file.type as keyof typeof propertyFileTypes];
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!extension || !matchesPropertyFileType(bytes, file.type)) return "Upload a valid PDF, JPEG, PNG or WebP file.";

  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return "Sign in again to upload a file.";

  const title = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9 _-]/g, "").trim().slice(0, 90) || "property-file";
  const path = `${property.data}/${crypto.randomUUID()}--${title}.${extension}`;
  const { error } = await supabase.storage.from(propertyFilesBucket).upload(path, file, { contentType: file.type, upsert: false });
  if (error) return "The file could not be saved. Check your property access and try again.";

  revalidatePath(`/dashboard/properties/${property.data}/files`);
  return "Private file uploaded.";
}
