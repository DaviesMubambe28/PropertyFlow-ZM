import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getServerEnvironment } from "@/lib/env/server";

export function createAdminClient() {
  const environment = getServerEnvironment();
  return createSupabaseClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
