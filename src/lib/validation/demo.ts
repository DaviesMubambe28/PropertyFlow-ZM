import { z } from "zod";

export const demoTeamSizes = ["1", "2–10", "11–50", "51+"] as const;
export const demoStatuses = ["new", "contacted", "qualified", "demo_requested", "evaluation", "pilot", "won", "lost", "closed"] as const;

export const demoRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  phone: z.string().trim().max(30).refine((phone) => !phone || /^\+?[0-9 ()-]{7,30}$/.test(phone)),
  teamSize: z.enum(demoTeamSizes),
  message: z.string().trim().max(2000),
});

export const demoUpdateSchema = z.object({
  id: z.uuid(),
  status: z.enum(demoStatuses),
  note: z.string().trim().max(2000),
});
