import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useQueries,
  useQuery,
} from "@tanstack/react-query";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import {
  userDetailsQueryOptions,
  usersQueryOptions,
} from "../../queries/userQueries";

import type { User } from "../../types/user.types";

function UserComparisonPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>(
    []
  );

  const [compareIds, setCompareIds] = useState<number[]>(
    []
  );

  const usersQuery = useQuery(
    usersQueryOptions({
      search: "",
      role: "",
      status: "",
      page: 1,
    })
  );

  

  const comparisonQueries = useQueries({
    queries: compareIds.map((userId) =>
      userDetailsQueryOptions(userId)
    ),
  });



  const handleSelectUser = (userId: number) => {
    setSelectedIds((current) => {
      if (current.includes(userId)) {
        return current.filter((id) => id !== userId);
      }

      return [...current, userId];
    });
  };


  const handleCompare = () => {
    if (selectedIds.length < 2) {
      return;
    }

    setCompareIds(selectedIds);
  };



  const handleRemove = (userId: number) => {
    setCompareIds((current) =>
      current.filter((id) => id !== userId)
    );

    setSelectedIds((current) =>
      current.filter((id) => id !== userId)
    );
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
        onRetry={() => usersQuery.refetch()}
      />
    );
  }

  const availableUsers =
    usersQuery.data?.users ?? [];

  if (availableUsers.length === 0) {
    return (
      <EmptyState message="No users available." />
    );
  }

  

  const isComparisonLoading =
    comparisonQueries.some(
      (query) => query.isLoading
    );

  const hasComparisonError =
    comparisonQueries.some(
      (query) => query.isError
    );

  const comparisonUsers =
    comparisonQueries
      .map((query) => query.data)
      .filter(Boolean) as User[];

  return (
    <main className="comparison-page">


      <div className="comparison-header">

        <div>
          <Link
            to="/users"
            className="back-link"
          >
            ← Back to Users
          </Link>

          <h1>User Comparison</h1>

          <p>
            Select users and compare their details.
          </p>
        </div>

        {comparisonQueries.some(
          (query) => query.isFetching
        ) && (
          <span className="updating-text">
            Updating...
          </span>
        )}

      </div>


      <section className="comparison-selector">

        <div className="comparison-selector-header">

          <div>
            <h2>Select Users</h2>

            <p>
              Choose two or more users to compare.
            </p>
          </div>

          <span className="selected-count">
            {selectedIds.length} selected
          </span>

        </div>

        <div className="comparison-user-list">

          {availableUsers.map((user) => {
            const isSelected =
              selectedIds.includes(user.id);

            return (
              <label
                key={user.id}
                className={`comparison-select-card ${
                  isSelected
                    ? "comparison-select-card-active"
                    : ""
                }`}
              >

                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    handleSelectUser(user.id)
                  }
                />

                <img
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                />

                <div className="comparison-select-info">

                  <strong>
                    {user.firstName}{" "}
                    {user.lastName}
                  </strong>

                  <span>
                    {user.email}
                  </span>

                  <small>
                    {user.company.name}
                  </small>

                </div>

              </label>
            );
          })}

        </div>

        <div className="comparison-selector-footer">

          <span>
            {selectedIds.length < 2
              ? "Select at least 2 users"
              : `${selectedIds.length} users ready to compare`}
          </span>

          <button
            className="compare-button"
            onClick={handleCompare}
            disabled={selectedIds.length < 2}
          >
            Compare Selected
          </button>

        </div>

      </section>

      {compareIds.length > 0 && (
        <section className="comparison-results">

          <div className="comparison-results-header">

            <div>
              <h2>Comparison</h2>

              <p>
                Comparing {compareIds.length} selected users.
              </p>
            </div>

            <button
              className="clear-comparison-button"
              onClick={() => {
                setCompareIds([]);
                setSelectedIds([]);
              }}
            >
              Clear Comparison
            </button>

          </div>

          {isComparisonLoading && (
            <Loader message="Loading comparison..." />
          )}

          {hasComparisonError && (
            <ErrorMessage
              message="Unable to load comparison users."
            />
          )}

          {!isComparisonLoading &&
            !hasComparisonError &&
            comparisonUsers.length > 0 && (

              <div className="comparison-table-wrapper">

                <table className="comparison-table">

                  <thead>

                    <tr>

                      <th>
                        Details
                      </th>

                      {comparisonUsers.map(
                        (user) => (
                          <th key={user.id}>

                            <div className="comparison-user-header">

                              <img
                                src={user.image}
                                alt={`${user.firstName} ${user.lastName}`}
                              />

                              <div>

                                <strong>
                                  {user.firstName}{" "}
                                  {user.lastName}
                                </strong>

                                <span>
                                  User ID: #{user.id}
                                </span>

                              </div>

                              <button
                                className="remove-comparison-button"
                                onClick={() =>
                                  handleRemove(user.id)
                                }
                              >
                                ×
                              </button>

                            </div>

                          </th>
                        )
                      )}

                    </tr>

                  </thead>

                  <tbody>

                    <tr>
                      <td className="comparison-label">
                        Email
                      </td>

                      {comparisonUsers.map(
                        (user) => (
                          <td key={user.id}>
                            {user.email}
                          </td>
                        )
                      )}
                    </tr>

                    <tr>
                      <td className="comparison-label">
                        Username
                      </td>

                      {comparisonUsers.map(
                        (user) => (
                          <td key={user.id}>
                            {user.username}
                          </td>
                        )
                      )}
                    </tr>

                    <tr>
                      <td className="comparison-label">
                        Role
                      </td>

                      {comparisonUsers.map(
                        (user) => (
                          <td key={user.id}>
                            <span className="comparison-role">
                              {user.role}
                            </span>
                          </td>
                        )
                      )}
                    </tr>

                    <tr>
                      <td className="comparison-label">
                        Company
                      </td>

                      {comparisonUsers.map(
                        (user) => (
                          <td key={user.id}>
                            {user.company.name}
                          </td>
                        )
                      )}
                    </tr>

                    <tr>
                      <td className="comparison-label">
                        Department
                      </td>

                      {comparisonUsers.map(
                        (user) => (
                          <td key={user.id}>
                            {user.company.department}
                          </td>
                        )
                      )}
                    </tr>

                    <tr>
                      <td className="comparison-label">
                        Job Title
                      </td>

                      {comparisonUsers.map(
                        (user) => (
                          <td key={user.id}>
                            {user.company.title}
                          </td>
                        )
                      )}
                    </tr>

                    <tr>
                      <td className="comparison-label">
                        Phone
                      </td>

                      {comparisonUsers.map(
                        (user) => (
                          <td key={user.id}>
                            {user.phone}
                          </td>
                        )
                      )}
                    </tr>

                    <tr>
                      <td className="comparison-label">
                        Age
                      </td>

                      {comparisonUsers.map(
                        (user) => (
                          <td key={user.id}>
                            {user.age}
                          </td>
                        )
                      )}
                    </tr>

                    <tr>
                      <td className="comparison-label">
                        Country
                      </td>

                      {comparisonUsers.map(
                        (user) => (
                          <td key={user.id}>
                            {user.address.country}
                          </td>
                        )
                      )}
                    </tr>

                    <tr>
                      <td className="comparison-label">
                        Status
                      </td>

                      {comparisonUsers.map(
                        (user) => (
                          <td key={user.id}>

                            <span
                              className={`status-badge status-${user.status}`}
                            >
                              {user.status}
                            </span>

                          </td>
                        )
                      )}
                    </tr>

                  </tbody>

                </table>

              </div>
            )}

        </section>
      )}

    </main>
  );
}

export default UserComparisonPage;