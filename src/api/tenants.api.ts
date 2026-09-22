import type {
  Tenant,
  TenantFilters,
} from "../types/tenant.types";

import type { User } from "../types/user.types";

const API_URL = "https://dummyjson.com";

interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

const PAGE_SIZE = 10;

async function fetchAllUsers(
  signal?: AbortSignal
): Promise<User[]> {
  const response = await fetch(
    `${API_URL}/users?limit=0`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data: UsersResponse =
    await response.json();

  return data.users;
}

function buildTenants(
  users: User[]
): Tenant[] {
  const companies = new Map<
    string,
    User[]
  >();

  users.forEach((user) => {
    const companyName =
      user.company.name;

    const existing =
      companies.get(companyName) ?? [];

    companies.set(companyName, [
      ...existing,
      user,
    ]);
  });

  return Array.from(
    companies.entries()
  ).map(
    ([companyName, companyUsers], index) => {

      const firstUser =
        companyUsers[0];

      return {
        id: index + 1,
        name: companyName,
        email: firstUser.email,
        phone: firstUser.phone,
        plan:
          index % 3 === 0
            ? "Premium"
            : index % 2 === 0
            ? "Standard"
            : "Basic",
        status:
          index % 2 === 0
            ? "active"
            : "inactive",
        userCount:
          companyUsers.length,
        createdAt:
          new Date(
            Date.now() -
              index *
                86400000
          ).toISOString(),
      };
    }
  );
}

export async function fetchTenants(
  filters: TenantFilters,
  signal?: AbortSignal
) {
  const users =
    await fetchAllUsers(signal);

  let tenants =
    buildTenants(users);

  if (filters.search.trim()) {
    const search =
      filters.search.toLowerCase();

    tenants = tenants.filter(
      (tenant) =>
        tenant.name
          .toLowerCase()
          .includes(search) ||
        tenant.email
          .toLowerCase()
          .includes(search)
    );
  }

  if (filters.status) {
    tenants = tenants.filter(
      (tenant) =>
        tenant.status ===
        filters.status
    );
  }

  if (filters.plan) {
    tenants = tenants.filter(
      (tenant) =>
        tenant.plan ===
        filters.plan
    );
  }

  const total = tenants.length;

  const skip =
    (filters.page - 1) *
    PAGE_SIZE;

  tenants = tenants.slice(
    skip,
    skip + PAGE_SIZE
  );

  return {
    tenants,
    total,
    skip,
    limit: PAGE_SIZE,
  };
}

export async function fetchTenantById(
  tenantId: number,
  signal?: AbortSignal
): Promise<Tenant> {
  const users =
    await fetchAllUsers(signal);

  const tenants =
    buildTenants(users);

  const tenant =
    tenants.find(
      (item) =>
        item.id === tenantId
    );

  if (!tenant) {
    throw new Error(
      "Tenant not found"
    );
  }

  return tenant;
}

export async function fetchTenantUsers(
  tenantId: number,
  signal?: AbortSignal
): Promise<User[]> {
  const users =
    await fetchAllUsers(signal);

  const tenants =
    buildTenants(users);

  const tenant =
    tenants.find(
      (item) =>
        item.id === tenantId
    );

  if (!tenant) {
    throw new Error(
      "Tenant not found"
    );
  }

  return users.filter(
    (user) =>
      user.company.name ===
      tenant.name
  );
}


export async function createTenant(
  tenant: Partial<Tenant>
): Promise<Tenant> {
  const response = await fetch(
    `${API_URL}/users/add`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        firstName: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        company: {
          name: tenant.name,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create tenant"
    );
  }

  return {
    ...tenant,
    id: Date.now(),
    name: tenant.name ?? "New Tenant",
    email: tenant.email ?? "",
    phone: tenant.phone ?? "",
    plan:
      tenant.plan ?? "Standard",
    status:
      tenant.status ?? "active",
    userCount: 0,
    createdAt:
      new Date().toISOString(),
  };
}

export async function updateTenant(
  tenantId: number,
  tenant: Partial<Tenant>
): Promise<Tenant> {
  const current =
    await fetchTenantById(
      tenantId
    );

  return {
    ...current,
    ...tenant,
    id: tenantId,
  };
}

export async function deleteTenant(
  tenantId: number
): Promise<void> {
  /*
   * Tenant data is derived from DummyJSON
   * company data, so there is no real
   * tenant resource to delete.
   *
   * This simulates a successful mutation.
   */
  void tenantId;

  return Promise.resolve();
}