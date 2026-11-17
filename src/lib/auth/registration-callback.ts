import { z } from "zod";

const registrationMetadataSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  pending_organization_email: z.string().trim().pipe(z.email()).transform((value) => value.toLowerCase()),
  pending_organization_name: z.string().trim().min(2).max(160),
});

export function getSafeCallbackPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/dashboard";
  return value;
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
