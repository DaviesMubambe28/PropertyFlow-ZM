import { z } from "zod";

const organizationId = z.uuid("Invalid organization.");
const optionalUuid = z.union([z.uuid(), z.literal("")]).transform((value) => value || undefined);
const shortText = (minimum: number, maximum: number, message: string) =>
  z.string().trim().min(minimum, message).max(maximum, `Use no more than ${maximum} characters.`);

export const propertyInputSchema = z.object({
  organizationId,
  title: shortText(2, 160, "Enter a property title."),
  type: shortText(2, 80, "Enter a property type."),
  listingType: z.enum(["sale", "rent"]),
  price: z.coerce.number().nonnegative("Price cannot be negative.").max(999999999999),
  location: shortText(2, 160, "Enter a location."),
  bedrooms: z.coerce.number().int().min(0).max(100),
  bathrooms: z.coerce.number().int().min(0).max(100),
  area: z.coerce.number().nonnegative().max(9999999999),
  description: z.string().trim().max(5000),
  imageUrl: z.union([z.url("Enter a valid image URL."), z.literal("")]),
});

export const contactInputSchema = z.object({
  organizationId,
  name: shortText(2, 160, "Enter the contact name."),
  email: z.string().trim().pipe(z.email("Enter a valid email address.")).transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(40),
  category: shortText(2, 40, "Choose a category."),
  leadSource: z.string().trim().max(80),
  budget: z.string().trim().max(80),
  notes: z.string().trim().max(5000),
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
  stage: z.enum(["new", "contacted", "qualified", "viewing_scheduled", "negotiation", "won", "lost"]),
});
