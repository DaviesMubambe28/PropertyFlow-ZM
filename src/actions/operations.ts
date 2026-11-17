"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  contactInputSchema,
  leadInputSchema,
  leadStageInputSchema,
  propertyInputSchema,
} from "@/lib/validation/operations";

export type OperationState = {
  status: "idle" | "error" | "success";
  message?: string;
  fields?: Record<string, string[] | undefined>;
};
export const initialOperationState: OperationState = { status: "idle" };

function invalid(fields: Record<string, string[] | undefined>): OperationState {
  return { status: "error", message: "Review the highlighted fields and try again.", fields };
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return { supabase, user: error ? null : data.user };
}

export async function createProperty(_state: OperationState, formData: FormData): Promise<OperationState> {
  const parsed = propertyInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error.flatten().fieldErrors);
  const { supabase, user } = await authenticatedClient();
  if (!user) return { status: "error", message: "Sign in again before saving the property." };
  const { error } = await supabase.from("properties").insert({
    organization_id: parsed.data.organizationId, title: parsed.data.title, type: parsed.data.type,
    listing_type: parsed.data.listingType, price: parsed.data.price, location: parsed.data.location,
    bedrooms: parsed.data.bedrooms, bathrooms: parsed.data.bathrooms, area: parsed.data.area,
    description: parsed.data.description, image_url: parsed.data.imageUrl || null, created_by: user.id,
  });
  if (error) return { status: "error", message: "The property could not be saved. Please try again." };
  revalidatePath("/dashboard");
  return { status: "success", message: "Property saved." };
}

export async function createContact(_state: OperationState, formData: FormData): Promise<OperationState> {
  const parsed = contactInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error.flatten().fieldErrors);
  const { supabase, user } = await authenticatedClient();
  if (!user) return { status: "error", message: "Sign in again before saving the contact." };
  const { error } = await supabase.from("contacts").insert({
    organization_id: parsed.data.organizationId, name: parsed.data.name, email: parsed.data.email,
    phone: parsed.data.phone, category: parsed.data.category, lead_source: parsed.data.leadSource,
    budget: parsed.data.budget, notes: parsed.data.notes, created_by: user.id,
  });
  if (error) return { status: "error", message: "The contact could not be saved. Please try again." };
  revalidatePath("/dashboard");
  return { status: "success", message: "Contact saved." };
}

export async function createLead(_state: OperationState, formData: FormData): Promise<OperationState> {
  const parsed = leadInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error.flatten().fieldErrors);
  const { supabase, user } = await authenticatedClient();
  if (!user) return { status: "error", message: "Sign in again before saving the lead." };
  const { error } = await supabase.from("leads").insert({
    organization_id: parsed.data.organizationId, contact_id: parsed.data.contactId,
    property_id: parsed.data.propertyId ?? null, title: parsed.data.title, value: parsed.data.value,
    notes: parsed.data.notes, assigned_to: user.id,
  });
  if (error) return { status: "error", message: "The lead could not be saved. Check the selected records and try again." };
  revalidatePath("/dashboard");
  return { status: "success", message: "Lead saved." };
}

export async function updateLeadStage(formData: FormData) {
  const parsed = leadStageInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { supabase, user } = await authenticatedClient();
  if (!user) return;
  await supabase.from("leads").update({ stage: parsed.data.stage }).eq("id", parsed.data.leadId);
  revalidatePath("/dashboard");
}
