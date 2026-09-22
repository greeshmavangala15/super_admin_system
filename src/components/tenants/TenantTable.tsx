import { Link } from "react-router-dom";

import type { Tenant } from "../../types/tenant.types";

interface TenantTableProps {
  tenants: Tenant[];

  onTenantHover?: (
    tenantId: number
  ) => void;

  onEdit?: (
    tenant: Tenant
  ) => void;

  onDelete?: (
    tenantId: number
  ) => void;
}

function TenantTable({
  tenants,
  onTenantHover,
  onEdit,
  onDelete,
}: TenantTableProps) {

  return (
    <div className="table-wrapper">

      <table className="tenant-table">

        <thead>
          <tr>
            <th>Tenant</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Users</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {tenants.map(
            (tenant) => (
              <tr key={tenant.id}>

                <td>
                  <strong>
                    {tenant.name}
                  </strong>
                </td>

                <td>
                  {tenant.email}
                </td>

                <td>
                  <span
                    className={`plan-badge plan-${tenant.plan.toLowerCase()}`}
                  >
                    {tenant.plan}
                  </span>
                </td>

                <td>
                  {tenant.userCount}
                </td>

                <td>
                  <span
                    className={`tenant-status tenant-status-${tenant.status}`}
                  >
                    {tenant.status}
                  </span>
                </td>

                <td>
  <div className="table-actions">

    <Link
      to={`/tenants/${tenant.id}`}
      onMouseEnter={() =>
        onTenantHover?.(
          tenant.id
        )
      }
    >
      View
    </Link>

    <button
      className="edit-button"
      onClick={() =>
        onEdit?.(tenant)
      }
    >
      Edit
    </button>

    <button
      className="delete-button"
      onClick={() =>
        onDelete?.(tenant.id)
      }
    >
      Delete
    </button>

  </div>
</td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}

export default TenantTable;