import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTenant,
  updateTenant,
  deleteTenant,
} from "../api/tenants.api";

import { queryKeys } from "../queries/queryKeys";

import type {
  Tenant,
  TenantStatus,
} from "../types/tenant.types";


export function useCreateTenant() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      tenant: Partial<Tenant>
    ) => createTenant(tenant),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.tenants.lists(),
      });
    },
  });
}


export function useUpdateTenant() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantId,
      tenant,
    }: {
      tenantId: number;
      tenant: Partial<Tenant>;
    }) =>
      updateTenant(
        tenantId,
        tenant
      ),

    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(
        queryKeys.tenants.detail(
          updatedTenant.id
        ),
        updatedTenant
      );

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.tenants.lists(),
      });
    },
  });
}


export function useDeleteTenant() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      tenantId: number
    ) => deleteTenant(tenantId),

    onSuccess: (_, tenantId) => {
      queryClient.removeQueries({
        queryKey:
          queryKeys.tenants.detail(
            tenantId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.tenants.lists(),
      });
    },
  });
}



interface UpdateTenantStatusVariables {
  tenantId: number;
  status: TenantStatus;
}

interface TenantStatusContext {
  previousTenant:
    | Tenant
    | undefined;
}

export function useUpdateTenantStatus() {
  const queryClient =
    useQueryClient();

  return useMutation<
    Tenant,
    Error,
    UpdateTenantStatusVariables,
    TenantStatusContext
  >({
    mutationFn: async ({
      tenantId,
      status,
    }) => {
      return updateTenant(
        tenantId,
        { status }
      );
    },

    onMutate: async ({
      tenantId,
      status,
    }) => {

      await queryClient.cancelQueries({
        queryKey:
          queryKeys.tenants.detail(
            tenantId
          ),
      });

      const previousTenant =
        queryClient.getQueryData<Tenant>(
          queryKeys.tenants.detail(
            tenantId
          )
        );

      if (previousTenant) {
        queryClient.setQueryData<Tenant>(
          queryKeys.tenants.detail(
            tenantId
          ),
          {
            ...previousTenant,
            status,
          }
        );
      }

      return {
        previousTenant,
      };
    },

    onError: (
      _error,
      variables,
      context
    ) => {

      if (
        context?.previousTenant
      ) {
        queryClient.setQueryData(
          queryKeys.tenants.detail(
            variables.tenantId
          ),
          context.previousTenant
        );
      }
    },

    onSettled: (
      _data,
      _error,
      variables
    ) => {

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.tenants.detail(
            variables.tenantId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.tenants.lists(),
      });
    },
  });
}