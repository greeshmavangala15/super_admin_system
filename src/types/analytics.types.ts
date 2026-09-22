export interface DashboardStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTenants: number;
  revenue: number;
}

export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}

export interface TenantStatistics {
  total: number;
  active: number;
  inactive: number;
}

export interface Activity {
  id: number;
  userId: number;
  action: string;
  description: string;
  date: string;
}