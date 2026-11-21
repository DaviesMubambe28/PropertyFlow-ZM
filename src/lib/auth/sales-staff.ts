import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getSalesStaffId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return !error && data.user?.app_metadata.propertyflow_sales_staff === true ? data.user.id : null;
}
