import { z } from "zod";

const organizationId = z.uuid("Invalid organization.");
const optionalUuid = z.union([z.uuid(), z.literal("")]).optional().transform((value) => value || undefined);
const shortText = (minimum: number, maximum: number, message: string) =>
  z.string().trim().min(minimum, message).max(maximum, `Use no more than ${maximum} characters.`);

export const propertyInputSchema = z.object({
  organizationId,
  propertyId: optionalUuid,
  title: shortText(2, 160, "Enter a property title."),
  type: shortText(2, 80, "Enter a property type."),
  listingType: z.enum(["sale", "rent"]),
  price: z.coerce.number().nonnegative("Price cannot be negative.").max(999999999999),
  location: shortText(2, 160, "Enter a location."),
  province: z.string().trim().max(80).default("Lusaka"),
  bedrooms: z.coerce.number().int().min(0).max(100),
  bathrooms: z.coerce.number().int().min(0).max(100),
  area: z.coerce.number().nonnegative().max(9999999999),
  description: z.string().trim().max(5000),
  imageUrl: z.union([z.url("Enter a valid image URL."), z.literal("")]),
  status: z.enum(["available", "reserved", "under_offer", "sold", "rented", "unavailable", "draft"]).default("available"),
  ownerName: z.string().trim().max(160).default(""),
  ownerPhone: z.string().trim().max(40).default(""),
});

export const contactInputSchema = z.object({
  organizationId,
  name: shortText(2, 160, "Enter the contact name."),
  email: z.string().trim().pipe(z.email("Enter a valid email address.")).transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(40),
  whatsapp: z.string().trim().max(40).default(""),
  category: shortText(2, 40, "Choose a category."),
  leadSource: z.string().trim().max(80),
  budget: z.string().trim().max(80),
  notes: z.string().trim().max(5000),
  preferredLocation: z.string().trim().max(160).default(""),
  preferences: z.string().trim().max(2000).default(""),
});

export const leadInputSchema = z.object({
  organizationId,
  contactId: z.uuid("Choose a contact."),
  propertyId: optionalUuid,
  title: shortText(2, 160, "Enter a lead title."),
  value: z.coerce.number().nonnegative().max(999999999999),
  notes: z.string().trim().max(5000),
});

export const leadStageInputSchema = z.object({
  leadId: z.uuid(),
  stage: z.enum(["new", "contacted", "interested", "viewing_scheduled", "negotiation", "converted", "lost"]),
});

const dateTime = z.string()
  .transform((value) => value.replace(/(T\d{2}:\d{2})(?=Z$|[+-]\d{2}:\d{2}$)/, "$1:00"))
  .pipe(z.union([z.iso.datetime({ local: true }), z.iso.datetime({ offset: true })]))
  .transform((value) => new Date(/(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}+02:00`).toISOString());

export const viewingInputSchema = z.object({
  organizationId,
  leadId: z.uuid(),
  propertyId: z.uuid(),
  scheduledAt: dateTime,
  notes: z.string().trim().max(5000),
});

export const viewingOutcomeSchema = z.object({
  viewingId: z.uuid(),
  status: z.enum(["scheduled", "completed", "cancelled", "missed"]),
  feedback: z.string().trim().max(5000),
  outcome: z.enum(["", "offer", "another_viewing", "discontinued"]),
});

export const taskInputSchema = z.object({
  organizationId,
  title: shortText(2, 200, "Enter a task title."),
  description: z.string().trim().max(5000),
  dueAt: dateTime,
  priority: z.enum(["low", "medium", "high"]),
  contactId: optionalUuid,
  propertyId: optionalUuid,
});

export const dealInputSchema = z.object({
  organizationId,
  leadId: z.uuid(),
  propertyId: z.uuid(),
  clientName: shortText(2, 160, "Enter the client name."),
  amount: z.coerce.number().nonnegative().max(999999999999),
  notes: z.string().trim().max(5000),
  transactionType: z.enum(["sale", "rental"]).default("sale"),
  closingDate: z.union([z.literal(""), z.iso.date()]).optional().transform((value) => value || undefined),
  leaseStart: z.union([z.literal(""), z.iso.date()]).optional().transform((value) => value || undefined),
  monthlyRent: z.union([z.literal(""), z.coerce.number().nonnegative()]).optional().transform((value) => value === "" ? undefined : value),
});

export const leadInteractionSchema = z.object({
  organizationId,
  leadId: z.uuid(),
  interactionType: z.enum(["note", "call", "whatsapp", "email", "meeting", "status_change"]),
  summary: shortText(2, 5000, "Enter an interaction summary."),
});

export const recordStatusSchema = z.object({
  recordId: z.uuid(),
  kind: z.enum(["task", "deal"]),
  status: z.enum(["open", "in_progress", "done", "completed", "cancelled"]),
}).superRefine((value, context) => {
  if (value.kind === "deal" && !["open", "completed", "cancelled"].includes(value.status)) {
    context.addIssue({ code: "custom", path: ["status"], message: "Invalid deal status." });
  }
  if (value.kind === "task" && !["open", "in_progress", "done"].includes(value.status)) {
    context.addIssue({ code: "custom", path: ["status"], message: "Invalid task status." });
  }
});

export const leadAssignmentSchema = z.object({
  organizationId,
  leadId: z.uuid(),
  assigneeId: z.uuid(),
});
