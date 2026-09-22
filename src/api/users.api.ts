import type {
  User,
  UserFilters,
} from "../types/user.types";

const API_URL = "https://dummyjson.com";

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

const PAGE_SIZE = 10;

export async function fetchUsers(
  filters: UserFilters,
  signal?: AbortSignal
): Promise<UsersResponse> {
  const { search, role, status, page } = filters;

  const skip = (page - 1) * PAGE_SIZE;

  let url = "";

  if (search.trim()) {
    url = `${API_URL}/users/search?q=${encodeURIComponent(
      search
    )}&limit=${PAGE_SIZE}&skip=${skip}`;
  } else if (role) {
    url = `${API_URL}/users/filter?key=role&value=${encodeURIComponent(
      role
    )}&limit=${PAGE_SIZE}&skip=${skip}`;
  } else {
    url = `${API_URL}/users?limit=${PAGE_SIZE}&skip=${skip}`;
  }

  const response = await fetch(url, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data: UsersResponse = await response.json();

  // Add status because DummyJSON users do not have a status field
  const usersWithStatus = data.users.map((user) => ({
    ...user,
    status:
      user.id % 3 === 0
        ? "suspended"
        : user.id % 2 === 0
        ? "inactive"
        : "active",
  }));

  // Apply status filter after calculating status
  const filteredUsers = status
    ? usersWithStatus.filter(
        (user) => user.status === status
      )
    : usersWithStatus;

  return {
    ...data,
    users: filteredUsers,
    total: status
      ? filteredUsers.length
      : data.total,
  };
}
export async function fetchUserById(
  userId: number,
  signal?: AbortSignal
): Promise<User> {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const user = await response.json();

  return {
    ...user,
    status:
      user.id % 3 === 0
        ? "suspended"
        : user.id % 2 === 0
        ? "inactive"
        : "active",
  };
}

export async function updateUserStatus(
  userId: number,
  status: string
): Promise<User> {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update user status");
  }

  return response.json();
}

export async function createUser(
  user: Partial<User>
): Promise<User> {
  const response = await fetch(
    `${API_URL}/users/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}

export async function updateUser(
  userId: number,
  user: Partial<User>
): Promise<User> {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
}

export async function deleteUser(
  userId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
}