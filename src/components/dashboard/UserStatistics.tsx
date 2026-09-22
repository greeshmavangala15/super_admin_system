import type {
  UserStatistics as UserStatisticsType,
} from "../../types/analytics.types";

interface UserStatisticsProps {
  statistics: UserStatisticsType;
}

function UserStatistics({
  statistics,
}: UserStatisticsProps) {
  return (
    <div className="statistics-card">
      <h3>User Statistics</h3>

      <div className="statistics-grid">
        <div>
          <span>Total</span>
          <strong>{statistics.total}</strong>
        </div>

        <div>
          <span>Active</span>
          <strong>{statistics.active}</strong>
        </div>

        <div>
          <span>Inactive</span>
          <strong>{statistics.inactive}</strong>
        </div>

        <div>
          <span>Suspended</span>
          <strong>{statistics.suspended}</strong>
        </div>
      </div>
    </div>
  );
}

export default UserStatistics;