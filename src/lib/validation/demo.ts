import { z } from "zod";

export const teamSizes = ["1", "2–5", "6–20", "21–50", "51+"] as const;
export const demoStatuses = ["new", "contacted", "closed"] as const;

export const demoRequestSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  company: z.string().trim().min(2).max(150),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  phone: z.string().trim().max(32).regex(/^(?:\+?[\d ().-]{7,32})?$/),
  teamSize: z.enum(teamSizes),
  requirements: z.string().trim().max(1500),
});

export const demoReviewSchema = z.object({
  id: z.uuid(),
  status: z.enum(demoStatuses),
  assignment: z.enum(["keep", "self", "clear"]),
  note: z.string().trim().max(1500),
});
