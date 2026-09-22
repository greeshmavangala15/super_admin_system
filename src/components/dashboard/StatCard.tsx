interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="stat-card">
      <p className="stat-card-title">
        {title}
      </p>

      <h2>{value}</h2>

      {description && (
        <p className="stat-card-description">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;