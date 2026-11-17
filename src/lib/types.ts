export type OrgType = "agency" | "independent_agent" | "landlord";
export type UserRole = "super_admin" | "owner" | "agent" | "staff" | "landlord";
export type SubscriptionStatus = "active" | "trial" | "pending" | "expired" | "suspended";
export type LeadStage = "new" | "contacted" | "qualified" | "viewing_scheduled" | "negotiation" | "won" | "lost";
export type TaskStatus = "open" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type ListingStatus = "active" | "draft" | "archived";

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
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: ListingStatus;
  imageUrl: string;
  description: string;
  featured: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  leadSource: string;
  budget: string;
  notes: string;
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
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
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
  createdAt: string;
}

export interface Deal {
  id: string;
  orgId: string;
  leadId: string;
  propertyId: string;
  clientName: string;
  amount: number;
  status: "open" | "closed";
  assignedTo: string;
  notes: string;
  createdAt: string;
  closedAt?: string;
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
  subscriptionPlans: SubscriptionPlan[];
  currentUserId: string | null;
  activeOrgId: string | null;
}
