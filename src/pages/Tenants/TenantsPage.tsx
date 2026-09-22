import { useEffect, useState } from "react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import TenantForm from "../../components/tenants/TenantForm";

import {
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from "../../hooks/useTenantMutations";

import type { Tenant } from "../../types/tenant.types";

import TenantFilters from "../../components/tenants/TenantFilters";
import TenantTable from "../../components/tenants/TenantTable";

import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import { useDebounce } from "../../hooks/useDebounce";

import {
  tenantsQueryOptions,
  tenantDetailsQueryOptions,
} from "../../queries/tenantQueries";

function TenantsPage() {
  const queryClient =
    useQueryClient();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [plan, setPlan] =
    useState("");

  const [page, setPage] =
    useState(1);

  const debouncedSearch =
    useDebounce(
      search,
      500
    );


    const [showForm, setShowForm] =
  useState(false);

const [editingTenant, setEditingTenant] =
  useState<Tenant | undefined>(
    undefined
  );

const createMutation =
  useCreateTenant();

const updateMutation =
  useUpdateTenant();

const deleteMutation =
  useDeleteTenant();

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    status,
    plan,
  ]);

  const tenantsQuery =
    useQuery(
      tenantsQueryOptions({
        search:
          debouncedSearch,
        status,
        plan,
        page,
      })
    );

  const handleTenantHover = (
    tenantId: number
  ) => {
    queryClient.prefetchQuery(
      tenantDetailsQueryOptions(
        tenantId
      )
    );
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setPlan("");
    setPage(1);
  };

  const handleCreateTenant = (
  data: Partial<Tenant>
) => {
  createMutation.mutate(data, {
    onSuccess: () => {
      setShowForm(false);
    },
  });
};

const handleEditTenant = (
  tenant: Tenant
) => {
  setEditingTenant(tenant);
};

const handleUpdateTenant = (
  data: Partial<Tenant>
) => {
  if (!editingTenant) {
    return;
  }

  updateMutation.mutate(
    {
      tenantId:
        editingTenant.id,
      tenant: data,
    },
    {
      onSuccess: () => {
        setEditingTenant(
          undefined
        );
      },
    }
  );
};

const handleDeleteTenant = (
  tenantId: number
) => {
  const confirmed =
    window.confirm(
      "Are you sure you want to delete this tenant?"
    );

  if (!confirmed) {
    return;
  }

  deleteMutation.mutate(
    tenantId
  );
};

  if (tenantsQuery.isLoading) {
    return (
      <Loader message="Loading tenants..." />
    );
  }

  if (tenantsQuery.isError) {
    return (
      <ErrorMessage
        message="Unable to load tenants."
        onRetry={() =>
          tenantsQuery.refetch()
        }
      />
    );
  }

  const data =
    tenantsQuery.data;

  if (!data) {
    return (
      <EmptyState message="No tenant data available." />
    );
  }

  return (
    <main className="tenants-page">

      <div className="page-header">

  <div>
    <h1>Tenants</h1>

    <p>
      Manage system tenants.
    </p>
  </div>

  <div className="header-actions">

    {tenantsQuery.isFetching && (
      <span className="updating-text">
        Updating...
      </span>
    )}

    <button
      className="add-user-button"
      onClick={() =>
        setShowForm(true)
      }
    >
      + Add Tenant
    </button>

  </div>

</div>

      <TenantFilters
        search={search}
        status={status}
        plan={plan}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPlanChange={setPlan}
        onReset={handleReset}
      />

      {data.tenants.length === 0 ? (
        <EmptyState
          message="No tenants found."
        />
      ) : (
        <>
          <TenantTable
  tenants={data.tenants}
  onTenantHover={
    handleTenantHover
  }
  onEdit={handleEditTenant}
  onDelete={
    handleDeleteTenant
  }
/>

          <Pagination
            page={page}
            totalPages={
              data.pageCount
            }
            onPageChange={setPage}
          />
        </>
      )}


      {showForm && (
  <TenantForm
    mode="add"
    isPending={
      createMutation.isPending
    }
    error={
      createMutation.error?.message
    }
    onSubmit={
      handleCreateTenant
    }
    onClose={() => {
      if (
        !createMutation.isPending
      ) {
        setShowForm(false);
      }
    }}
  />
)}

{editingTenant && (
  <TenantForm
    mode="edit"
    tenant={editingTenant}
    isPending={
      updateMutation.isPending
    }
    error={
      updateMutation.error?.message
    }
    onSubmit={
      handleUpdateTenant
    }
    onClose={() => {
      if (
        !updateMutation.isPending
      ) {
        setEditingTenant(
          undefined
        );
      }
    }}
  />
)}

    </main>
  );
}

export default TenantsPage;