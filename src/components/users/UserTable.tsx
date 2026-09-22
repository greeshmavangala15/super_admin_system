import { Link } from "react-router-dom";

import type { User } from "../../types/user.types";

interface UserTableProps {
  users: User[];
  onUserHover?: (userId: number) => void;
  onDelete?: (userId: number) => void;
  onEdit?: (user: User) => void;
}

function UserTable({
  users,
  onUserHover,
  onDelete,
  onEdit,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        No users found.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Company</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {user.firstName} {user.lastName}
              </td>

              <td>
                {user.email}
              </td>

              <td>
                {user.role}
              </td>
              <td>
                {user.company.name}
              </td>

        
              <td>
                <span
                  className={`status-badge status-${user.status}`}
                >
                  {user.status}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <Link
                    to={`/users/${user.id}`}
                    onMouseEnter={() =>
                      onUserHover?.(user.id)
                    }
                  >
                    View
                  </Link>

                  <button
                    className="edit-button"
                    onClick={() =>
                      onEdit?.(user)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      onDelete?.(user.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;