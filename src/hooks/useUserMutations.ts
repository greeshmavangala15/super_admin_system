import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} from "../api/users.api";

import { queryKeys } from "../queries/queryKeys";

import type {
  User,
  UserStatus,
} from "../types/user.types";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: Partial<User>) =>
      createUser(user),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      user,
    }: {
      userId: number;
      user: Partial<User>;
    }) => updateUser(userId, user),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        queryKeys.users.detail(updatedUser.id),
        updatedUser
      );

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) =>
      deleteUser(userId),

    onSuccess: (_, userId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.users.detail(userId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });
    },
  });
}


interface UpdateStatusVariables {
  userId: number;
  status: UserStatus;
}

interface StatusContext {
  previousUser: User | undefined;
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    User,
    Error,
    UpdateStatusVariables,
    StatusContext
  >({
    mutationFn: ({
      userId,
      status,
    }) => updateUserStatus(userId, status),

    onMutate: async ({
      userId,
      status,
    }) => {

      
      await queryClient.cancelQueries({
        queryKey: queryKeys.users.detail(userId),
      });

      
      const previousUser =
        queryClient.getQueryData<User>(
          queryKeys.users.detail(userId)
        );

      
      if (previousUser) {
        queryClient.setQueryData<User>(
          queryKeys.users.detail(userId),
          {
            ...previousUser,
            status,
          }
        );
      }

      return {
        previousUser,
      };
    },

    onError: (_error, variables, context) => {

      if (context?.previousUser) {
        queryClient.setQueryData(
          queryKeys.users.detail(
            variables.userId
          ),
          context.previousUser
        );
      }
    },

    
    onSettled: (_data, _error, variables) => {

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(
          variables.userId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });
    },
  });
}