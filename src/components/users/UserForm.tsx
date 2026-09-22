import { useEffect, useState } from "react";

import type { User } from "../../types/user.types";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<
    "admin" | "moderator" | "user"
  >("user");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);
      setUsername(user.username);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = (event: React.FormEvent) => {
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
              <label>First Name</label>
              <input
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
                required
              />
            </div>

            <div className="form-field">
              <label>Last Name</label>
              <input
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
                required
              />
            </div>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="form-field">
              <label>Phone</label>
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />
            </div>

            <div className="form-field">
              <label>Username</label>
              <input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            </div>

            <div className="form-field">
              <label>Role</label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value as
                      | "admin"
                      | "moderator"
                      | "user"
                  )
                }
              >
                <option value="user">User</option>
                <option value="moderator">
                  Moderator
                </option>
                <option value="admin">Admin</option>
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