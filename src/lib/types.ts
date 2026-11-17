export type OrgType = "agency" | "independent_agent" | "landlord";
export type UserRole = "super_admin" | "owner" | "agent" | "staff" | "landlord";
export type SubscriptionStatus = "active" | "trial" | "pending" | "expired" | "suspended";
export type LeadStage = "new" | "contacted" | "interested" | "viewing_scheduled" | "negotiation" | "converted" | "lost";
export type TaskStatus = "open" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type ListingStatus = "available" | "reserved" | "under_offer" | "sold" | "rented" | "unavailable" | "draft";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  orgId: string;
}

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  contactEmail: string;
  phone: string;
  location?: string;
  logoUrl?: string;
  timezone: string;
  currency: string;
  subscriptionPlanId: string;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
  listingLimit: number;
  seatLimit: number;
}

export interface Property {
  id: string;
  orgId: string;
  title: string;
  type: string;
  listingType: "sale" | "rent";
  price: number;
  location: string;
  province?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: ListingStatus;
  imageUrl: string;
  description: string;
  featured: boolean;
  ownerName?: string;
  ownerPhone?: string;
  assignedTo?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  category: string;
  leadSource: string;
  budget: string;
  notes: string;
  preferredLocation?: string;
  preferences?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  orgId: string;
  contactId: string;
  propertyId?: string;
  title: string;
  stage: LeadStage;
  assignedTo: string;
  value: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Viewing {
  id: string;
  orgId: string;
  leadId: string;
  propertyId: string;
  date: string;
  agentId: string;
  status: "scheduled" | "completed" | "cancelled" | "missed";
  notes: string;
  feedback?: string;
  outcome?: "" | "offer" | "another_viewing" | "discontinued";
}

export interface TaskItem {
  id: string;
  orgId: string;
  title: string;
  description: string;
  assigneeId: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  contactId?: string;
  propertyId?: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  orgId: string;
  leadId: string;
  propertyId: string;
  clientName: string;
  amount: number;
  status: "open" | "completed" | "cancelled";
  assignedTo: string;
  notes: string;
  createdAt: string;
  closedAt?: string;
  transactionType?: "sale" | "rental";
  closingDate?: string;
  leaseStart?: string;
  monthlyRent?: number;
}

export interface LeadInteraction {
  id: string;
  orgId: string;
  leadId: string;
  interactionType: "note" | "call" | "whatsapp" | "email" | "meeting" | "status_change";
  summary: string;
  createdBy: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  seats: number;
  listings: number;
  description: string;
  enabled: boolean;
}

export interface AppState {
  organizations: Organization[];
  users: User[];
  properties: Property[];
  contacts: Contact[];
  leads: Lead[];
  viewings: Viewing[];
  tasks: TaskItem[];
  deals: Deal[];
  leadInteractions: LeadInteraction[];
  subscriptionPlans: SubscriptionPlan[];
  currentUserId: string | null;
  activeOrgId: string | null;
}
