import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Title is required"),
  type: z.string().min(2, "Choose a property type"),
  listingType: z.enum(["sale", "rent"]),
  price: z.coerce.number().positive(),
  location: z.string().min(3),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  area: z.coerce.number().min(1),
  description: z.string().min(5),
  imageUrl: z.string().url().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  category: z.string().min(2),
  budget: z.string().min(1),
  notes: z.string().min(2),
  leadSource: z.string().min(2),
});

export const leadSchema = z.object({
  title: z.string().min(3),
  value: z.coerce.number().min(0),
  notes: z.string().min(3),
  stage: z.string().min(2),
});
