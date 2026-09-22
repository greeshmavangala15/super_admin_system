export const queryKeys = {
  users: {
    all: ["users"] as const,

    lists: () =>
      [...queryKeys.users.all, "list"] as const,

    list: (filters: {
      search: string;
      role: string;
      status: string;
      page: number;
    }) =>
      [
        ...queryKeys.users.lists(),
        filters,
      ] as const,

    details: () =>
      [...queryKeys.users.all, "detail"] as const,

    detail: (userId: number) =>
      [
        ...queryKeys.users.details(),
        userId,
      ] as const,

    activity: (userId: number) =>
      [
        ...queryKeys.users.all,
        "activity",
        userId,
      ] as const,
  },

  tenants: {
    all: ["tenants"] as const,

    lists: () =>
      [...queryKeys.tenants.all, "list"] as const,

    list: (filters: {
      search: string;
      status: string;
      plan: string;
      page: number;
    }) =>
      [
        ...queryKeys.tenants.lists(),
        filters,
      ] as const,

    details: () =>
      [...queryKeys.tenants.all, "detail"] as const,

    detail: (tenantId: number) =>
      [
        ...queryKeys.tenants.details(),
        tenantId,
      ] as const,

    users: (tenantId: number) =>
      [
        ...queryKeys.tenants.all,
        "users",
        tenantId,
      ] as const,
  },

  analytics: {
    dashboard: [
      "analytics",
      "dashboard",
    ] as const,

    users: [
      "analytics",
      "users",
    ] as const,

    tenants: [
      "analytics",
      "tenants",
    ] as const,
  },
};  