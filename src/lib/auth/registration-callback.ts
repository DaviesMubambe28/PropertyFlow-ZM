import { z } from "zod";
import { safeReturnPath } from "@/lib/auth/redirects";

const registrationMetadataSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  pending_organization_email: z.string().trim().pipe(z.email()).transform((value) => value.toLowerCase()),
  pending_organization_name: z.string().trim().min(2).max(160),
});

export function getSafeCallbackPath(value: string | null) {
  return safeReturnPath(value);
}

export function getAdministratorBootstrapInput(metadata: unknown) {
  const parsed = registrationMetadataSchema.safeParse(metadata);
  if (!parsed.success) return null;
  return {
    p_email: parsed.data.pending_organization_email,
    p_full_name: parsed.data.full_name,
    p_name: parsed.data.pending_organization_name,
  };
}
