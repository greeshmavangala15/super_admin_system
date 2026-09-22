import { useState } from "react";

import type {
  User,
  UserRole,
} from "../../types/user.types";

interface UserFormProps {
  user?: User;
  mode: "add" | "edit";
  isPending: boolean;
  error?: string;
  onSubmit: (data: Partial<User>) => void;
  onClose: () => void;
}

function UserForm({
  user,
  mode,
  isPending,
  error,
  onSubmit,
  onClose,
}: UserFormProps) {
  const [firstName, setFirstName] =
    useState(user?.firstName ?? "");

  const [lastName, setLastName] =
    useState(user?.lastName ?? "");

  const [email, setEmail] =
    useState(user?.email ?? "");

  const [phone, setPhone] =
    useState(user?.phone ?? "");

  const [username, setUsername] =
    useState(user?.username ?? "");

  const [role, setRole] =
    useState<UserRole>(
      user?.role ?? "user"
    );

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    onSubmit({
      firstName,
      lastName,
      email,
      phone,
      username,
      role,
    });
  };

  return (
    <div className="modal-overlay">

      <div className="user-form-modal">

        <div className="modal-header">

          <div>
            <h2>
              {mode === "add"
                ? "Add User"
                : "Edit User"}
            </h2>

            <p>
              {mode === "add"
                ? "Create a new system user."
                : "Update user information."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-field">
              <label>
                First Name
              </label>

              <input
                value={firstName}
                onChange={(event) =>
                  setFirstName(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label>
                Last Name
              </label>

              <input
                value={lastName}
                onChange={(event) =>
                  setLastName(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label>
                Phone
              </label>

              <input
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-field">
              <label>
                Username
              </label>

              <input
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label>
                Role
              </label>

              <select
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value as UserRole
                  )
                }
              >
                <option value="user">
                  User
                </option>

                <option value="moderator">
                  Moderator
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : mode === "add"
                ? "Create User"
                : "Update User"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default UserForm;