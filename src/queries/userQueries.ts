import { queryOptions } from "@tanstack/react-query";

import {
  fetchUsers,
  fetchUserById,
} from "../api/users.api";

import { fetchUserActivity } from "../api/activity.api";

import { queryKeys } from "./queryKeys";

import type { UserFilters } from "../types/user.types";

export const usersQueryOptions = (filters: UserFilters) =>
  queryOptions({
    queryKey: queryKeys.users.list(filters),

    queryFn: ({ signal }) =>
      fetchUsers(filters, signal),

    placeholderData: (previousData) => previousData,

    select: (data) => ({
      users: data.users,
      total: data.total,
      pageCount: Math.ceil(data.total / 10),
    }),
  });

export const userDetailsQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: queryKeys.users.detail(userId),

    queryFn: ({ signal }) =>
      fetchUserById(userId, signal),

    enabled: userId > 0,
  });

export const userActivityQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: queryKeys.users.activity(userId),

    queryFn: ({ signal }) =>
      fetchUserActivity(userId, signal),

    enabled: userId > 0,
  });