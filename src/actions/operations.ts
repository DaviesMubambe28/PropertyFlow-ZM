"use server";

import type { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  contactInputSchema,
  dealInputSchema,
  leadInputSchema,
  leadInteractionSchema,
  leadStageInputSchema,
  propertyInputSchema,
  propertyUpdateSchema,
  recordStatusSchema,
  taskInputSchema,
  viewingInputSchema,
  viewingOutcomeSchema,
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
    ...propertyFields(parsed.data),
    organization_id: parsed.data.organizationId, assigned_to: user.id, created_by: user.id,
  });
  if (error) return { status: "error", message: "The property could not be saved. Please try again." };
  revalidatePath("/dashboard");
  return { status: "success", message: "Property saved." };
}

function propertyFields(property: z.infer<typeof propertyInputSchema>) {
  return {
    title: property.title, type: property.type, listing_type: property.listingType,
    price: property.price, location: property.location, province: property.province,
    bedrooms: property.bedrooms, bathrooms: property.bathrooms, area: property.area,
    description: property.description, image_url: property.imageUrl || null, status: property.status,
    owner_name: property.ownerName, owner_phone: property.ownerPhone,
  };
}

export async function updateProperty(_state: OperationState, formData: FormData): Promise<OperationState> {
  const parsed = propertyUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error.flatten().fieldErrors);
  const { supabase, user } = await authenticatedClient();
  if (!user) return { status: "error", message: "Sign in again before updating the property." };

  const { data, error } = await supabase.from("properties")
    .update(propertyFields(parsed.data))
    .eq("organization_id", parsed.data.organizationId)
    .eq("id", parsed.data.propertyId)
    .eq("updated_at", parsed.data.updatedAt)
    .select("id")
    .maybeSingle();

  if (error) return { status: "error", message: "The property could not be updated. Please try again." };
  if (!data) return { status: "error", message: "The property changed or is no longer accessible. Refresh and try again." };
  revalidatePath("/dashboard");
  return { status: "success", message: "Property updated." };
}

export async function createContact(_state: OperationState, formData: FormData): Promise<OperationState> {
  const parsed = contactInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error.flatten().fieldErrors);
  const { supabase, user } = await authenticatedClient();
  if (!user) return { status: "error", message: "Sign in again before saving the contact." };
  const { error } = await supabase.from("contacts").insert({
    organization_id: parsed.data.organizationId, name: parsed.data.name, email: parsed.data.email,
    phone: parsed.data.phone, category: parsed.data.category, lead_source: parsed.data.leadSource,
    whatsapp: parsed.data.whatsapp, preferred_location: parsed.data.preferredLocation,
    preferences: parsed.data.preferences, budget: parsed.data.budget, notes: parsed.data.notes, created_by: user.id,
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

export async function createViewing(_state: OperationState, formData: FormData): Promise<OperationState> {
  const parsed = viewingInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error.flatten().fieldErrors);
  const { supabase, user } = await authenticatedClient();
  if (!user) return { status: "error", message: "Sign in again before scheduling the viewing." };
  const { error } = await supabase.from("viewings").insert({
    organization_id: parsed.data.organizationId, lead_id: parsed.data.leadId,
    property_id: parsed.data.propertyId, scheduled_at: parsed.data.scheduledAt,
    agent_id: user.id, notes: parsed.data.notes,
  });
  if (error) return { status: "error", message: "The viewing could not be scheduled. Check the linked lead and property." };
  revalidatePath("/dashboard");
  return { status: "success", message: "Viewing scheduled." };
}

export async function createTask(_state: OperationState, formData: FormData): Promise<OperationState> {
  const parsed = taskInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error.flatten().fieldErrors);
  const { supabase, user } = await authenticatedClient();
  if (!user) return { status: "error", message: "Sign in again before creating the task." };
  const { error } = await supabase.from("tasks").insert({
    organization_id: parsed.data.organizationId, title: parsed.data.title,
    description: parsed.data.description, due_at: parsed.data.dueAt,
    priority: parsed.data.priority, contact_id: parsed.data.contactId ?? null,
    property_id: parsed.data.propertyId ?? null, assignee_id: user.id, created_by: user.id,
  });
  if (error) return { status: "error", message: "The task could not be saved. Please try again." };
  revalidatePath("/dashboard");
  return { status: "success", message: "Task created." };
}

export async function createDeal(_state: OperationState, formData: FormData): Promise<OperationState> {
  const parsed = dealInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error.flatten().fieldErrors);
  const { supabase, user } = await authenticatedClient();
  if (!user) return { status: "error", message: "Sign in again before creating the deal." };
  const { error } = await supabase.from("deals").insert({
    organization_id: parsed.data.organizationId, lead_id: parsed.data.leadId,
    property_id: parsed.data.propertyId, client_name: parsed.data.clientName,
    amount: parsed.data.amount, assigned_to: user.id, notes: parsed.data.notes,
    transaction_type: parsed.data.transactionType, closing_date: parsed.data.closingDate ?? null,
    lease_start: parsed.data.leaseStart ?? null, monthly_rent: parsed.data.monthlyRent ?? null,
  });
  if (error) return { status: "error", message: "The deal could not be saved. Check the linked lead and property." };
  revalidatePath("/dashboard");
  return { status: "success", message: "Deal created." };
}

export async function addLeadInteraction(_state: OperationState, formData: FormData): Promise<OperationState> {
  const parsed = leadInteractionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error.flatten().fieldErrors);
  const { supabase, user } = await authenticatedClient();
  if (!user) return { status: "error", message: "Sign in again before recording the interaction." };
  const { error } = await supabase.from("lead_interactions").insert({
    organization_id: parsed.data.organizationId, lead_id: parsed.data.leadId,
    interaction_type: parsed.data.interactionType, summary: parsed.data.summary, created_by: user.id,
  });
  if (error) return { status: "error", message: "The interaction could not be saved." };
  revalidatePath("/dashboard");
  return { status: "success", message: "Interaction recorded." };
}

export async function updateViewingOutcome(formData: FormData) {
  const parsed = viewingOutcomeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { supabase, user } = await authenticatedClient();
  if (!user) return;
  await supabase.from("viewings").update({
    status: parsed.data.status, feedback: parsed.data.feedback, outcome: parsed.data.outcome,
  }).eq("id", parsed.data.viewingId);
  revalidatePath("/dashboard");
}

export async function updateOperationalStatus(formData: FormData) {
  const parsed = recordStatusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { supabase, user } = await authenticatedClient();
  if (!user) return;
  if (parsed.data.kind === "task") {
    await supabase.from("tasks").update({ status: parsed.data.status }).eq("id", parsed.data.recordId);
  } else {
    await supabase.from("deals").update({
      status: parsed.data.status,
      closed_at: parsed.data.status === "completed" ? new Date().toISOString() : null,
    }).eq("id", parsed.data.recordId);
  }
  revalidatePath("/dashboard");
}
