import type {
  DashboardStatistics,
  UserStatistics,
  TenantStatistics,
} from "../types/analytics.types";

import type { User } from "../types/user.types";

const API_URL =
  "https://dummyjson.com";

interface DummyUsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

async function fetchAllUsers(
  signal?: AbortSignal
): Promise<User[]> {
  const response = await fetch(
    `${API_URL}/users?limit=0`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch users"
    );
  }

  const data: DummyUsersResponse =
    await response.json();

  return data.users;
}

/* ================= STATUS HELPER ================= */

function getUserStatus(
  userId: number
) {
  if (userId % 3 === 0) {
    return "suspended";
  }

  if (userId % 2 === 0) {
    return "inactive";
  }

  return "active";
}

/* ================= DASHBOARD ================= */

export async function fetchDashboardStatistics(
  signal?: AbortSignal
): Promise<DashboardStatistics> {
  const users =
    await fetchAllUsers(signal);

  const activeUsers =
    users.filter(
      (user) =>
        getUserStatus(user.id) ===
        "active"
    ).length;

  const inactiveUsers =
    users.filter(
      (user) =>
        getUserStatus(user.id) !==
        "active"
    ).length;

  return {
    totalUsers: users.length,
    activeUsers,
    inactiveUsers,
    totalTenants:
      new Set(
        users.map(
          (user) =>
            user.company.name
        )
      ).size,
    revenue: 0,
  };
}

/* ================= USER STATISTICS ================= */

export async function fetchUserStatistics(
  signal?: AbortSignal
): Promise<UserStatistics> {
  const users =
    await fetchAllUsers(signal);

  return {
    total: users.length,

    active: users.filter(
      (user) =>
        getUserStatus(user.id) ===
        "active"
    ).length,

    inactive: users.filter(
      (user) =>
        getUserStatus(user.id) ===
        "inactive"
    ).length,

    suspended: users.filter(
      (user) =>
        getUserStatus(user.id) ===
        "suspended"
    ).length,
  };
}

/* ================= TENANT STATISTICS ================= */

export async function fetchTenantStatistics(
  signal?: AbortSignal
): Promise<TenantStatistics> {
  const users =
    await fetchAllUsers(signal);

  const companies = new Set(
    users.map(
      (user) =>
        user.company.name
    )
  );

  const activeUsers =
    users.filter(
      (user) =>
        getUserStatus(user.id) ===
        "active"
    );

  const activeCompanies =
    new Set(
      activeUsers.map(
        (user) =>
          user.company.name
      )
    );

  return {
    total: companies.size,

    active:
      activeCompanies.size,

    inactive: Math.max(
      companies.size -
        activeCompanies.size,
      0
    ),
  };
}