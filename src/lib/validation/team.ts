import { z } from "zod";

export const invitationInputSchema = z.object({
  organizationId: z.uuid(),
  email: z.string().trim().pipe(z.email("Enter a valid email address.")).transform((value) => value.toLowerCase()),
});

export const membershipStatusSchema = z.object({
  organizationId: z.uuid(),
  userId: z.uuid(),
  status: z.enum(["active", "deactivated"]),
});

export const invitationAcceptanceSchema = z.object({ invitationId: z.uuid() });
