import type {
  User,
  UserFilters,
  UserStatus,
} from "../types/user.types";

const API_URL = "https://dummyjson.com";

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

const PAGE_SIZE = 10;

function getUserStatus(
  userId: number
): UserStatus {
  if (userId % 3 === 0) {
    return "suspended";
  }

  if (userId % 2 === 0) {
    return "inactive";
  }

  return "active";
}

export async function fetchUsers(
  filters: UserFilters,
  signal?: AbortSignal
): Promise<UsersResponse> {
  const {
    search,
    role,
    status,
    page,
  } = filters;

  let url: string;

  if (search.trim()) {
    url =
      `${API_URL}/users/search` +
      `?q=${encodeURIComponent(search)}` +
      `&limit=0`;
  } else {
    url =
      `${API_URL}/users?limit=0`;
  }

  const response = await fetch(
    url,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch users"
    );
  }

  const data: UsersResponse =
    await response.json();

  let users = data.users.map(
    (user): User => ({
      ...user,
      status: getUserStatus(user.id),
    })
  );

  if (role) {
    users = users.filter(
      (user) =>
        user.role === role
    );
  }

  if (status) {
    users = users.filter(
      (user) =>
        user.status === status
    );
  }

  const total = users.length;

  const skip =
    (page - 1) * PAGE_SIZE;

  const paginatedUsers =
    users.slice(
      skip,
      skip + PAGE_SIZE
    );

  return {
    users: paginatedUsers,
    total,
    skip,
    limit: PAGE_SIZE,
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
    throw new Error(
      "Failed to fetch user"
    );
  }

  const user =
    await response.json();

  return {
    ...user,
    status: getUserStatus(
      user.id
    ),
  };
}

export async function updateUserStatus(
  userId: number,
  status: UserStatus
): Promise<User> {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update user status"
    );
  }

  const user =
    await response.json();

  return {
    ...user,
    status,
  };
}

export async function createUser(
  user: Partial<User>
): Promise<User> {
  const response = await fetch(
    `${API_URL}/users/add`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create user"
    );
  }

  const createdUser =
    await response.json();

  return {
    ...createdUser,
    status:
      createdUser.status ??
      "active",
  };
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
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update user"
    );
  }

  const updatedUser =
    await response.json();

  return {
    ...updatedUser,
    status:
      updatedUser.status ??
      getUserStatus(userId),
  };
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
    throw new Error(
      "Failed to delete user"
    );
  }
}