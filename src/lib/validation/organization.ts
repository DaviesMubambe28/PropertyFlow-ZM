import { z } from "zod";

const safeLogoUrl = z.union([
  z.literal(""),
  z.url("Enter a valid logo URL.").refine((value) => new URL(value).protocol === "https:", "Logo URL must use HTTPS."),
]);

export const organizationProfileSchema = z.object({
  organizationId: z.uuid(),
  name: z.string().trim().min(2, "Enter the agency name.").max(160),
  email: z.string().trim().pipe(z.email("Enter a valid agency email.")).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(40).default(""),
  location: z.string().trim().max(160).default(""),
  logoUrl: safeLogoUrl.default(""),
  timezone: z.literal("Africa/Lusaka").default("Africa/Lusaka"),
  currency: z.string().trim().toUpperCase().pipe(z.literal("ZMW")),
});
