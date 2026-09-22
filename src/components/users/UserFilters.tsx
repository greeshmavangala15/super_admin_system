interface UserFiltersProps {
  search: string;
  role: string;
  status: string;
  onSearchChange: (
    value: string
  ) => void;
  onRoleChange: (
    value: string
  ) => void;
  onStatusChange: (
    value: string
  ) => void;
  onReset: () => void;
}

function UserFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onReset,
}: UserFiltersProps) {
  return (
    <div className="user-filters">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(event) =>
          onSearchChange(
            event.target.value
          )
        }
      />

      <select
        value={role}
        onChange={(event) =>
          onRoleChange(
            event.target.value
          )
        }
      >
        <option value="">
          All Roles
        </option>

        <option value="admin">
          Admin
        </option>

        <option value="moderator">
          Moderator
        </option>

        <option value="user">
          User
        </option>
      </select>

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

        <option value="suspended">
          Suspended
        </option>
      </select>

      <button onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default UserFilters;