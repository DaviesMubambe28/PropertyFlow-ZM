import { describe, expect, it } from "vitest";
import { contactInputSchema, dealInputSchema, leadInputSchema, propertyInputSchema, taskInputSchema, viewingInputSchema } from "./operations";

describe("operational input schemas", () => {
  it("normalizes a valid property payload", () => {
    expect(propertyInputSchema.parse({
      organizationId: "30000000-0000-4000-8000-000000000001",
      title: " Kabulonga Home ", type: "House", listingType: "sale", price: "750000",
      location: " Lusaka ", bedrooms: "3", bathrooms: "2", area: "180.5",
      description: "A secure family home", imageUrl: "",
    })).toMatchObject({ title: "Kabulonga Home", price: 750000, area: 180.5 });
  });

  it("rejects invalid or oversized property values", () => {
    expect(propertyInputSchema.safeParse({ organizationId: "bad", title: "x", price: "-1" }).success).toBe(false);
  });

  it("normalizes contact emails and permits optional notes", () => {
    expect(contactInputSchema.parse({
      organizationId: "30000000-0000-4000-8000-000000000001", name: "Buyer One",
      email: " BUYER@TEST.LOCAL ", phone: "+260 955 000 000", category: "buyer",
      leadSource: "Website", budget: "K750,000", notes: "",
    })).toMatchObject({ email: "buyer@test.local", notes: "" });
  });

  it("requires a same-workspace contact identifier for leads", () => {
    expect(leadInputSchema.safeParse({
      organizationId: "30000000-0000-4000-8000-000000000001", contactId: "not-a-uuid",
      propertyId: "", title: "New enquiry", value: "500000", notes: "",
    }).success).toBe(false);
  });

  it("validates linked viewing, task, and deal inputs", () => {
    const shared = { organizationId: "30000000-0000-4000-8000-000000000001" };
    expect(viewingInputSchema.safeParse({ ...shared, leadId: "30000000-0000-4000-8000-000000000002", propertyId: "30000000-0000-4000-8000-000000000003", scheduledAt: "2026-12-01T10:30", notes: "" }).success).toBe(true);
    expect(taskInputSchema.safeParse({ ...shared, title: "Call buyer", description: "", dueAt: "2026-12-01T10:30", priority: "high" }).success).toBe(true);
    expect(dealInputSchema.safeParse({ ...shared, leadId: "30000000-0000-4000-8000-000000000002", propertyId: "30000000-0000-4000-8000-000000000003", clientName: "Buyer One", amount: "750000", notes: "" }).success).toBe(true);
  });

  it("keeps optional deal terms empty and rejects invalid dates", () => {
    const deal = {
      organizationId: "30000000-0000-4000-8000-000000000001",
      leadId: "30000000-0000-4000-8000-000000000002",
      propertyId: "30000000-0000-4000-8000-000000000003",
      clientName: "Buyer One",
      amount: "750000",
      notes: "",
      transactionType: "sale",
      monthlyRent: "",
      closingDate: "",
      leaseStart: "",
    };

    expect(dealInputSchema.parse(deal)).toMatchObject({
      monthlyRent: undefined,
      closingDate: undefined,
      leaseStart: undefined,
    });
    expect(dealInputSchema.safeParse({ ...deal, closingDate: "not-a-date" }).success).toBe(false);
  });
});
