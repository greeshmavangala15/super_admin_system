interface TenantFiltersProps {
  search: string;
  status: string;
  plan: string;

  onSearchChange: (
    value: string
  ) => void;

  onStatusChange: (
    value: string
  ) => void;

  onPlanChange: (
    value: string
  ) => void;

  onReset: () => void;
}

function TenantFilters({
  search,
  status,
  plan,
  onSearchChange,
  onStatusChange,
  onPlanChange,
  onReset,
}: TenantFiltersProps) {
  return (
    <div className="tenant-filters">

      <input
        type="text"
        placeholder="Search tenants..."
        value={search}
        onChange={(event) =>
          onSearchChange(
            event.target.value
          )
        }
      />

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(
            event.target.value
          )
        }
      >
        <option value="">
          All Status
        </option>

        <option value="active">
          Active
        </option>

        <option value="inactive">
          Inactive
        </option>
      </select>

      <select
        value={plan}
        onChange={(event) =>
          onPlanChange(
            event.target.value
          )
        }
      >
        <option value="">
          All Plans
        </option>

        <option value="Basic">
          Basic
        </option>

        <option value="Standard">
          Standard
        </option>

        <option value="Premium">
          Premium
        </option>
      </select>

      <button
        onClick={onReset}
      >
        Reset
      </button>

    </div>
  );
}

export default TenantFilters;