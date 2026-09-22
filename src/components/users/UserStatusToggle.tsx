import type { UserStatus } from "../../types/user.types";

interface UserStatusToggleProps {
  status: UserStatus;
  isPending: boolean;
  onChange: (
    status: UserStatus
  ) => void;
}

function UserStatusToggle({
  status,
  isPending,
  onChange,
}: UserStatusToggleProps) {

  const nextStatus: UserStatus =
    status === "active"
      ? "inactive"
      : "active";

  return (
    <button
      className={`status-toggle ${
        status === "active"
          ? "status-active"
          : "status-inactive"
      }`}
      disabled={isPending}
      onClick={() =>
        onChange(nextStatus)
      }
    >
      {isPending
        ? "Updating..."
        : status === "active"
        ? "Active"
        : "Inactive"}
    </button>
  );
}

export default UserStatusToggle;