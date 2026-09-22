import { useState } from "react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Link } from "react-router-dom";

import UserForm from "../../components/users/UserForm";

import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../../hooks/useUserMutations";

import type { User } from "../../types/user.types";

import UserFilters from "../../components/users/UserFilters";
import UserTable from "../../components/users/UserTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import { useDebounce } from "../../hooks/useDebounce";

import {
  usersQueryOptions,
  userDetailsQueryOptions,
} from "../../queries/userQueries";

function UsersPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [page, setPage] =
    useState(1);

  const debouncedSearch =
    useDebounce(search, 500);

  const [showForm, setShowForm] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<User | undefined>(
      undefined
    );

  const createMutation =
    useCreateUser();

  const deleteMutation =
    useDeleteUser();

  const updateMutation =
    useUpdateUser();

  const usersQuery = useQuery(
    usersQueryOptions({
      search: debouncedSearch,
      role,
      status,
      page,
    })
  );

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (
    value: string
  ) => {
    setRole(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: string
  ) => {
    setStatus(value);
    setPage(1);
  };

  const handleUserHover = (
    userId: number
  ) => {
    queryClient.prefetchQuery(
      userDetailsQueryOptions(userId)
    );
  };

  const handleCreateUser = (
    user: Partial<User>
  ) => {
    createMutation.mutate(user, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const handleDeleteUser = (
    userId: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(userId);
  };

  const handleUpdateUser = (
    data: Partial<User>
  ) => {
    if (!editingUser) {
      return;
    }

    updateMutation.mutate(
      {
        userId: editingUser.id,
        user: data,
      },
      {
        onSuccess: () => {
          setEditingUser(undefined);
        },
      }
    );
  };

  const handleEditUser = (
    user: User
  ) => {
    setEditingUser(user);
  };

  const handleReset = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  };

  if (usersQuery.isLoading) {
    return (
      <Loader message="Loading users..." />
    );
  }

  if (usersQuery.isError) {
    return (
      <ErrorMessage
        message="Unable to load users."
        onRetry={() =>
          usersQuery.refetch()
        }
      />
    );
  }

  const data = usersQuery.data;

  if (!data) {
    return (
      <EmptyState
        message="No user data available."
      />
    );
  }

  return (
    <main className="users-page">

      <div className="page-header">

        <div>
          <h1>Users</h1>

          <p>
            Manage system users.
          </p>
        </div>

        <div className="header-actions">

          {usersQuery.isFetching && (
            <span className="updating-text">
              Updating...
            </span>
          )}

          <button
            className="add-user-button"
            onClick={() =>
              setShowForm(true)
            }
          >
            + Add User
          </button>

        </div>

      </div>

      <div className="user-page-links">

        <Link
          to="/users/compare"
          className="secondary-action-button"
        >
          Compare Users
        </Link>

        <Link
          to="/users/infinite"
          className="secondary-action-button"
        >
          Infinite Users
        </Link>

      </div>

      <UserFilters
        search={search}
        role={role}
        status={status}
        onSearchChange={
          handleSearchChange
        }
        onRoleChange={
          handleRoleChange
        }
        onStatusChange={
          handleStatusChange
        }
        onReset={handleReset}
      />

      {data.users.length === 0 ? (
        <EmptyState
          message="No users found."
        />
      ) : (
        <>
          <UserTable
            users={data.users}
            onUserHover={
              handleUserHover
            }
            onDelete={
              handleDeleteUser
            }
            onEdit={
              handleEditUser
            }
          />

          <Pagination
            page={page}
            totalPages={
              data.pageCount
            }
            onPageChange={
              setPage
            }
          />
        </>
      )}

      {showForm && (
        <UserForm
          key="add-user"
          mode="add"
          isPending={
            createMutation.isPending
          }
          error={
            createMutation.error
              ?.message
          }
          onSubmit={
            handleCreateUser
          }
          onClose={() => {
            if (
              !createMutation.isPending
            ) {
              setShowForm(false);
            }
          }}
        />
      )}

      {editingUser && (
        <UserForm
          key={editingUser.id}
          mode="edit"
          user={editingUser}
          isPending={
            updateMutation.isPending
          }
          error={
            updateMutation.error
              ?.message
          }
          onSubmit={
            handleUpdateUser
          }
          onClose={() => {
            if (
              !updateMutation.isPending
            ) {
              setEditingUser(
                undefined
              );
            }
          }}
        />
      )}

    </main>
  );
}

export default UsersPage;