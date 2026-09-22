import type {
  TenantStatistics as TenantStatisticsType,
} from "../../types/analytics.types";

interface TenantStatisticsProps {
  statistics: TenantStatisticsType;
}

function TenantStatistics({
  statistics,
}: TenantStatisticsProps) {
  return (
    <div className="statistics-card">
      <h3>Tenant Statistics</h3>

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
      </div>
    </div>
  );
}

export default TenantStatistics;