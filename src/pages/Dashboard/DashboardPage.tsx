import { useQuery } from "@tanstack/react-query";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import StatCard from "../../components/dashboard/StatCard";
import UserStatistics from "../../components/dashboard/UserStatistics";
import TenantStatistics from "../../components/dashboard/TenantStatistics";

import {
  dashboardStatisticsOptions,
  userStatisticsOptions,
  tenantStatisticsOptions,
  recentActivityOptions,
} from "../../queries/analyticsQueries";

function DashboardPage() {
  const dashboardQuery = useQuery(
    dashboardStatisticsOptions()
  );

  const userStatisticsQuery = useQuery(
    userStatisticsOptions()
  );

  const tenantStatisticsQuery = useQuery(
    tenantStatisticsOptions()
  );

  const activityQuery = useQuery(
    recentActivityOptions()
  );

  const isInitialLoading =
    dashboardQuery.isLoading ||
    userStatisticsQuery.isLoading ||
    tenantStatisticsQuery.isLoading ||
    activityQuery.isLoading;

  if (isInitialLoading) {
    return <Loader message="Loading dashboard..." />;
  }

  const hasError =
    dashboardQuery.isError ||
    userStatisticsQuery.isError ||
    tenantStatisticsQuery.isError ||
    activityQuery.isError;

  if (hasError) {
    return (
      <ErrorMessage
        message="Unable to load dashboard data."
        onRetry={() => {
          dashboardQuery.refetch();
          userStatisticsQuery.refetch();
          tenantStatisticsQuery.refetch();
          activityQuery.refetch();
        }}
      />
    );
  }

  const dashboard = dashboardQuery.data;
  const userStatistics = userStatisticsQuery.data;
  const tenantStatistics = tenantStatisticsQuery.data;
  const activities = activityQuery.data ?? [];

  if (
    !dashboard ||
    !userStatistics ||
    !tenantStatistics
  ) {
    return (
      <EmptyState
        message="No dashboard data available."
      />
    );
  }

  const isFetching =
    dashboardQuery.isFetching ||
    userStatisticsQuery.isFetching ||
    tenantStatisticsQuery.isFetching ||
    activityQuery.isFetching;

  const handleRefresh = async () => {
    await Promise.all([
      dashboardQuery.refetch(),
      userStatisticsQuery.refetch(),
      tenantStatisticsQuery.refetch(),
      activityQuery.refetch(),
    ]);
  };

  const getActivityTitle = (
    index: number
  ): string => {
    const titles = [
      "New user activity recorded",
      "User activity updated",
      "Recent system activity",
      "User action recorded",
      "New activity was recorded",
    ];

    return titles[index % titles.length];
  };

  const getActivityDescription = (
    index: number
  ): string => {
    const descriptions = [
      "A new post was created",
      "A new post was added by a user",
      "New user content was added",
      "Recent activity was detected",
      "A user performed an action",
    ];

    return descriptions[index % descriptions.length];
  };

  return (
    <main className="dashboard-page">


      <div className="page-header">
        <div className="dashboard-heading">
          <span className="dashboard-eyebrow">
            Overview
          </span>

          <h1>
            Super Admin Dashboard
          </h1>

          <p>
            Monitor users, tenants and recent
            system activity from one place.
          </p>
        </div>

        <div className="header-actions">
          {isFetching && (
            <span className="updating-text">
              Updating...
            </span>
          )}

          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            {isFetching
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>
      </div>


      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <h2>
              Overview
            </h2>

            <p>
              Current system summary
            </p>
          </div>
        </div>

        <div className="dashboard-stat-grid">

          <StatCard
            title="Total Users"
            value={dashboard.totalUsers}
          />

          <StatCard
            title="Active Users"
            value={dashboard.activeUsers}
          />

          <StatCard
            title="Tenants"
            value={dashboard.totalTenants}
          />

          <StatCard
            title="Revenue"
            value={`$${dashboard.revenue}`}
          />

        </div>
      </section>


      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <h2>
              Statistics
            </h2>

            <p>
              User and tenant distribution
            </p>
          </div>
        </div>

        <div className="dashboard-statistics-grid">

          <UserStatistics
            statistics={userStatistics}
          />

          <TenantStatistics
            statistics={tenantStatistics}
          />

        </div>
      </section>


      <section className="dashboard-card">

        <div className="dashboard-card-header">

          <div>
            <h2>
              Recent Activity
            </h2>

            <p>
              Latest activity across the system.
            </p>
          </div>

          {activityQuery.isFetching && (
            <span className="updating-text">
              Updating...
            </span>
          )}

        </div>

        {activities.length === 0 ? (

          <EmptyState
            message="No recent activity available."
          />

        ) : (

          <div className="activity-list">

            {activities.map(
              (activity, index) => (

                <div
                  key={activity.id}
                  className="activity-item"
                >

                  <div className="activity-content">

                    <div className="activity-dot" />

                    <div className="activity-text">

                      <strong>
                        {getActivityTitle(index)}
                      </strong>

                      <p>
                        {getActivityDescription(index)}
                      </p>

                    </div>

                  </div>

                  <span className="activity-date">
                    {new Date(
                      activity.date
                    ).toLocaleString()}
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}

export default DashboardPage;