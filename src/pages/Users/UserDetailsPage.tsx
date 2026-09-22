import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import UserStatusToggle from "../../components/users/UserStatusToggle";

import {
  useUpdateUserStatus,
} from "../../hooks/useUserMutations";

import type {
  UserStatus,
} from "../../types/user.types";

import {
  userDetailsQueryOptions,
  userActivityQueryOptions,
} from "../../queries/userQueries";

function UserDetailsPage() {

    const statusMutation =useUpdateUserStatus();
  const { userId } = useParams();

  const id = Number(userId);

  const userQuery = useQuery(
    userDetailsQueryOptions(id)
  );

  const activityQuery = useQuery(
    userActivityQueryOptions(id)
  );

  if (userQuery.isLoading) {
    return <Loader message="Loading user details..." />;
  }

  if (userQuery.isError) {
    return (
      <ErrorMessage
        message="Unable to load user details."
        onRetry={() => userQuery.refetch()}
      />
    );
  }

  if (!userQuery.data) {
    return (
      <EmptyState message="User not found." />
    );
  }

  const user = userQuery.data;

  return (
    <main className="user-details-page">

      <div className="details-header">
        <div>
          <Link
            to="/users"
            className="back-link"
          >
            ← Back to Users
          </Link>

          <h1>
            {user.firstName} {user.lastName}
          </h1>

          <p>User ID: {user.id}</p>
        </div>

        {userQuery.isFetching && (
          <span className="updating-text">
            Updating...
          </span>
        )}
      </div>

      <section className="user-profile-card">

        <div className="user-profile-top">

          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="user-avatar"
          />

          <div>
            <h2>
              {user.firstName} {user.lastName}
            </h2>

            <p>{user.email}</p>

            <span className="role-badge">
              {user.role}
            </span>
          </div>

          <div className="user-status-section">

  <span className="status-label">
    Account Status
  </span>

  <UserStatusToggle
    status={user.status}
    isPending={statusMutation.isPending}
    onChange={(status: UserStatus) => {
      statusMutation.mutate({
        userId: user.id,
        status,
      });
    }}
  />

</div>

        </div>

        <div className="details-grid">

          <div className="detail-item">
            <span>Username</span>
            <strong>{user.username}</strong>
          </div>

          <div className="detail-item">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="detail-item">
            <span>Phone</span>
            <strong>{user.phone}</strong>
          </div>

          <div className="detail-item">
            <span>Age</span>
            <strong>{user.age}</strong>
          </div>

          <div className="detail-item">
            <span>Gender</span>
            <strong>{user.gender}</strong>
          </div>

          <div className="detail-item">
            <span>Company</span>
            <strong>{user.company.name}</strong>
          </div>

          <div className="detail-item">
            <span>Department</span>
            <strong>{user.company.department}</strong>
          </div>

          <div className="detail-item">
            <span>Job Title</span>
            <strong>{user.company.title}</strong>
          </div>

          <div className="detail-item">
            <span>University</span>
            <strong>{user.university}</strong>
          </div>

          <div className="detail-item">
            <span>City</span>
            <strong>{user.address.city}</strong>
          </div>

        </div>

      </section>

      <section className="activity-card">

        <div className="activity-header">
          <div>
            <h2>User Activity</h2>
            <p>Recent activity for this user</p>
          </div>

          {activityQuery.isFetching && (
            <span className="updating-text">
              Updating...
            </span>
          )}
        </div>

        {activityQuery.isLoading && (
          <Loader message="Loading activity..." />
        )}

        {activityQuery.isError && (
          <ErrorMessage
            message="Unable to load user activity."
            onRetry={() => activityQuery.refetch()}
          />
        )}

        {activityQuery.isSuccess &&
          activityQuery.data.length === 0 && (
            <EmptyState message="No activity found." />
          )}

        {activityQuery.isSuccess &&
          activityQuery.data.length > 0 && (
            <div className="activity-list">

              {activityQuery.data.map((activity) => (
                <div
                  key={activity.id}
                  className="activity-item"
                >
                  <div className="activity-dot" />

                  <div>
                    <strong>
                      {activity.action}
                    </strong>

                    <p>
                      {activity.description}
                    </p>

                    <small>
                      {new Date(
                        activity.date
                      ).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}

            </div>
          )}

      </section>

    </main>
  );
}

export default UserDetailsPage;