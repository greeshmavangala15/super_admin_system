export type TenantStatus = "active" | "inactive";

export type TenantPlan = "Basic" | "Standard" | "Premium";

export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: TenantPlan;
  status: TenantStatus;
  userCount: number;
  createdAt: string;
}

export interface TenantDetails extends Tenant {
  address?: string;
  contactPerson?: string;
}

export interface TenantFilters {
  search: string;
  status: string;
  plan: string;
  page: number;
}