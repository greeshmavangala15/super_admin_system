import { useInfiniteQuery } from "@tanstack/react-query";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import type { User } from "../../types/user.types";

const API_URL = "https://dummyjson.com";

const PAGE_SIZE = 10;

interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

async function fetchUsersPage(
  pageParam: number,
  signal?: AbortSignal
): Promise<UsersResponse> {
  const response = await fetch(
    `${API_URL}/users?limit=${PAGE_SIZE}&skip=${pageParam}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

function InfiniteUsersPage() {
  const usersQuery = useInfiniteQuery({
    queryKey: ["users", "infinite"],

    queryFn: ({ pageParam, signal }) =>
      fetchUsersPage(pageParam, signal),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;

      if (nextSkip >= lastPage.total) {
        return undefined;
      }

      return nextSkip;
    },
  });

  if (usersQuery.isLoading) {
    return <Loader message="Loading users..." />;
  }

  if (usersQuery.isError) {
    return (
      <ErrorMessage
        message="Unable to load users."
        onRetry={() => usersQuery.refetch()}
      />
    );
  }

  const users =
    usersQuery.data?.pages.flatMap(
      (page) => page.users
    ) ?? [];

  if (users.length === 0) {
    return <EmptyState message="No users found." />;
  }

  return (
    <main className="infinite-users-page">



      <div className="page-header">
        <div>
          <h1>Infinite Users</h1>

          <p>
            Load users continuously
          </p>
        </div>

        {usersQuery.isFetching &&
          !usersQuery.isFetchingNextPage && (
            <span className="updating-text">
              Updating...
            </span>
          )}
      </div>


      
      <div className="infinite-user-grid">

        {users.map((user) => (
          <div
            key={user.id}
            className="infinite-user-card"
          >

            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
            />



            <div className="infinite-user-info">

              <h3>
                {user.firstName}{" "}
                {user.lastName}
              </h3>

              <p>
                {user.email}
              </p>

              <span>
                {user.company.name}
              </span>

            </div>

          </div>
        ))}

      </div>


      <div className="infinite-actions">

        <button
          type="button"
          onClick={() =>
            usersQuery.fetchNextPage()
          }
          disabled={
            !usersQuery.hasNextPage ||
            usersQuery.isFetchingNextPage
          }
          className="load-more-button"
        >
          {usersQuery.isFetchingNextPage
            ? "Loading..."
            : usersQuery.hasNextPage
            ? "Load More Users"
            : "No More Users"}
        </button>

      </div>

    </main>
  );
}

export default InfiniteUsersPage;