import { queryOptions } from "@tanstack/react-query";

import {
  fetchDashboardStatistics,
  fetchUserStatistics,
  fetchTenantStatistics,
} from "../api/analytics.api";

import { fetchRecentActivity } from "../api/activity.api";

import { queryKeys } from "./queryKeys";

export const dashboardStatisticsOptions = () =>
  queryOptions({
    queryKey: queryKeys.analytics.dashboard,

    queryFn: ({ signal }) =>
      fetchDashboardStatistics(signal),

    select: (data) => ({
      totalUsers: data.totalUsers,
      activeUsers: data.activeUsers,
      totalTenants: data.totalTenants,
      revenue: data.revenue,
    }),
  });

export const userStatisticsOptions = () =>
  queryOptions({
    queryKey: queryKeys.analytics.users,

    queryFn: ({ signal }) =>
      fetchUserStatistics(signal),

    select: (data) => ({
      total: data.total,
      active: data.active,
      inactive: data.inactive,
      suspended: data.suspended,
    }),
  });

export const tenantStatisticsOptions = () =>
  queryOptions({
    queryKey: queryKeys.analytics.tenants,

    queryFn: ({ signal }) =>
      fetchTenantStatistics(signal),

    select: (data) => ({
      total: data.total,
      active: data.active,
      inactive: data.inactive,
    }),
  });

export const recentActivityOptions = () =>
  queryOptions({
    queryKey: ["activities", "recent"] as const,

    queryFn: ({ signal }) =>
      fetchRecentActivity(signal),

    select: (activities) =>
      activities.slice(0, 5),
  });