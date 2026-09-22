import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import {
  tenantDetailsQueryOptions,
  tenantUsersQueryOptions,
} from "../../queries/tenantQueries";

import {
  useUpdateTenantStatus,
} from "../../hooks/useTenantMutations";

import type {
  TenantStatus,
} from "../../types/tenant.types";

function TenantDetailsPage() {
  const { tenantId } = useParams();

  const id = Number(tenantId);

  const statusMutation =
  useUpdateTenantStatus();

  const tenantQuery = useQuery(
    tenantDetailsQueryOptions(id)
  );


  const tenantUsersQuery = useQuery(
    tenantUsersQueryOptions(id)
  );

  if (tenantQuery.isLoading) {
    return (
      <Loader message="Loading tenant details..." />
    );
  }

  if (tenantQuery.isError) {
    return (
      <ErrorMessage
        message="Unable to load tenant details."
        onRetry={() =>
          tenantQuery.refetch()
        }
      />
    );
  }

  if (!tenantQuery.data) {
    return (
      <EmptyState message="Tenant not found." />
    );
  }

  const tenant = tenantQuery.data;

  return (
    <main className="tenant-details-page">

      {/* Header */}

      <div className="details-header">

        <div>

          <Link
            to="/tenants"
            className="back-link"
          >
            ← Back to Tenants
          </Link>

          <h1>{tenant.name}</h1>

          <p>
            Tenant ID: {tenant.id}
          </p>

        </div>

        {tenantQuery.isFetching && (
          <span className="updating-text">
            Updating...
          </span>
        )}

      </div>

      <section className="tenant-profile-card">

        <div className="tenant-profile-top">

          <div className="tenant-avatar">
            {tenant.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <h2>
              {tenant.name}
            </h2>

            <p>
              {tenant.email}
            </p>

            <div className="tenant-badges">

              <span
                className={`plan-badge plan-${tenant.plan.toLowerCase()}`}
              >
                {tenant.plan}
              </span>

              <span
                className={`tenant-status tenant-status-${tenant.status}`}
              >
                {tenant.status}
              </span>

            </div>

            <div className="user-status-section">

  <span className="status-label">
    Tenant Status
  </span>

  <button
    className={`status-toggle ${
      tenant.status === "active"
        ? "status-active"
        : "status-inactive"
    }`}
    disabled={
      statusMutation.isPending
    }
    onClick={() => {
      const nextStatus: TenantStatus =
        tenant.status === "active"
          ? "inactive"
          : "active";

      statusMutation.mutate({
        tenantId: tenant.id,
        status: nextStatus,
      });
    }}
  >
    {statusMutation.isPending
      ? "Updating..."
      : tenant.status === "active"
      ? "Active"
      : "Inactive"}
  </button>

</div>

          </div>

        </div>

        <div className="details-grid">

          <div className="detail-item">
            <span>Email</span>
            <strong>
              {tenant.email}
            </strong>
          </div>

          <div className="detail-item">
            <span>Phone</span>
            <strong>
              {tenant.phone}
            </strong>
          </div>

          <div className="detail-item">
            <span>Plan</span>
            <strong>
              {tenant.plan}
            </strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>
              {tenant.status}
            </strong>
          </div>

          <div className="detail-item">
            <span>Total Users</span>
            <strong>
              {tenant.userCount}
            </strong>
          </div>

          <div className="detail-item">
            <span>Created</span>
            <strong>
              {new Date(
                tenant.createdAt
              ).toLocaleDateString()}
            </strong>
          </div>

        </div>

      </section>



      <section className="tenant-users-card">

        <div className="activity-header">

          <div>
            <h2>
              Tenant Users
            </h2>

            <p>
              Users belonging to this tenant
            </p>
          </div>

          {tenantUsersQuery.isFetching && (
            <span className="updating-text">
              Updating...
            </span>
          )}

        </div>

        {tenantUsersQuery.isLoading && (
          <Loader message="Loading tenant users..." />
        )}

        {tenantUsersQuery.isError && (
          <ErrorMessage
            message="Unable to load tenant users."
            onRetry={() =>
              tenantUsersQuery.refetch()
            }
          />
        )}

        {tenantUsersQuery.isSuccess &&
          tenantUsersQuery.data.length === 0 && (
            <EmptyState
              message="No users found for this tenant."
            />
          )}

        {tenantUsersQuery.isSuccess &&
          tenantUsersQuery.data.length > 0 && (
            <div className="tenant-users-list">

              {tenantUsersQuery.data.map(
                (user) => (
                  <Link
                    key={user.id}
                    to={`/users/${user.id}`}
                    className="tenant-user-row"
                  >

                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                    />

                    <div>
                      <strong>
                        {user.firstName}{" "}
                        {user.lastName}
                      </strong>

                      <span>
                        {user.email}
                      </span>
                    </div>

                    <span className="user-role">
                      {user.role}
                    </span>

                  </Link>
                )
              )}

            </div>
          )}

      </section>

    </main>
  );
}

export default TenantDetailsPage;