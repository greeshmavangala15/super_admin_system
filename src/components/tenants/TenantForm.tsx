import { useEffect, useState } from "react";

import type {
  Tenant,
  TenantPlan,
  TenantStatus,
} from "../../types/tenant.types";

interface TenantFormProps {
  tenant?: Tenant;
  mode: "add" | "edit";
  isPending: boolean;
  error?: string;
  onSubmit: (
    data: Partial<Tenant>
  ) => void;
  onClose: () => void;
}

function TenantForm({
  tenant,
  mode,
  isPending,
  error,
  onSubmit,
  onClose,
}: TenantFormProps) {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [plan, setPlan] =
    useState<TenantPlan>("Standard");

  const [status, setStatus] =
    useState<TenantStatus>("active");

  useEffect(() => {
    if (tenant) {
      setName(tenant.name);
      setEmail(tenant.email);
      setPhone(tenant.phone);
      setPlan(tenant.plan);
      setStatus(tenant.status);
    }
  }, [tenant]);

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    onSubmit({
      name,
      email,
      phone,
      plan,
      status,
    });
  };

  return (
    <div className="modal-overlay">

      <div className="tenant-form-modal">

        <div className="modal-header">

          <div>
            <h2>
              {mode === "add"
                ? "Add Tenant"
                : "Edit Tenant"}
            </h2>

            <p>
              {mode === "add"
                ? "Create a new tenant."
                : "Update tenant information."}
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

        <form
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            <div className="form-field">
              <label>
                Tenant Name
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(
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
                Plan
              </label>

              <select
                value={plan}
                onChange={(event) =>
                  setPlan(
                    event.target
                      .value as TenantPlan
                  )
                }
              >
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
            </div>

            <div className="form-field">
              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as TenantStatus
                  )
                }
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
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
                ? "Create Tenant"
                : "Update Tenant"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default TenantForm;