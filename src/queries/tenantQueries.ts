import { queryOptions } from "@tanstack/react-query";

import {
  fetchTenants,
  fetchTenantById,
  fetchTenantUsers,
} from "../api/tenants.api";

import { queryKeys } from "./queryKeys";

import type { TenantFilters } from "../types/tenant.types";

export const tenantsQueryOptions = (
  filters: TenantFilters
) =>
  queryOptions({
    queryKey:
      queryKeys.tenants.list(
        filters
      ),

    queryFn: ({ signal }) =>
      fetchTenants(
        filters,
        signal
      ),

    placeholderData:
      (previousData) =>
        previousData,

    select: (data) => ({
      tenants:
        data.tenants,

      total:
        data.total,

      pageCount:
        Math.ceil(
          data.total / 10
        ),
    }),
  });

export const tenantDetailsQueryOptions = (
  tenantId: number
) =>
  queryOptions({
    queryKey:
      queryKeys.tenants.detail(
        tenantId
      ),

    queryFn: ({ signal }) =>
      fetchTenantById(
        tenantId,
        signal
      ),

    enabled:
      tenantId > 0,
  });

export const tenantUsersQueryOptions = (
  tenantId: number
) =>
  queryOptions({
    queryKey:
      queryKeys.tenants.users(
        tenantId
      ),

    queryFn: ({ signal }) =>
      fetchTenantUsers(
        tenantId,
        signal
      ),

    enabled:
      tenantId > 0,
  });