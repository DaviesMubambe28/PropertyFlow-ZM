import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function getDemoStaff() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return !error && data.user?.app_metadata.enterprise_demo_staff === true ? data.user : null;
}
