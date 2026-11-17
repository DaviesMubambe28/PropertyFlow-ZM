import { z } from "zod";

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().trim().min(1),
});

const serverEnvironmentSchema = publicEnvironmentSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1),
});

function formatEnvironmentError(error: z.ZodError) {
  const names = [...new Set(error.issues.map((issue) => String(issue.path[0])))]
    .sort()
    .join(", ");
  return new Error(`Missing or invalid environment configuration: ${names}`);
}

export function parsePublicEnvironment(input: unknown) {
  const parsed = publicEnvironmentSchema.safeParse(input);
  if (!parsed.success) throw formatEnvironmentError(parsed.error);
  return parsed.data;
}

export function parseServerEnvironment(input: unknown) {
  const parsed = serverEnvironmentSchema.safeParse(input);
  if (!parsed.success) throw formatEnvironmentError(parsed.error);
  return parsed.data;
}
