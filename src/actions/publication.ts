"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const publicationInput = z.object({
  propertyId: z.uuid(),
  version: z.iso.datetime({ offset: true }),
  decision: z.enum(["publish", "withdraw"]),
});

export async function setPropertyPublication(_previous: string | null, formData: FormData) {
  const input = publicationInput.safeParse(Object.fromEntries(formData));
  if (!input.success) return "Choose a valid listing and publication action.";
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return "Sign in again to manage publication.";

  const publish = input.data.decision === "publish";
  const { data, error } = await supabase.rpc("set_property_publication", {
    property_id: input.data.propertyId,
    publish,
    expected_version: input.data.version,
  });
  if (error || data !== true) {
    return "The change couldn’t be saved. Check that you manage this agency and refresh the available property before publishing.";
  }
  revalidatePath("/properties");
  revalidatePath(`/properties/${input.data.propertyId}`);
  return publish ? "Listing published." : "Listing withdrawn.";
}
