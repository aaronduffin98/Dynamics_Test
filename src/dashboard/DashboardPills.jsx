export default function DashboardPills({ items, onItemClick }) {
  if (!items.length) {
    return null;
  }

  return (
    <ul className="dashboard-pills">
      {items.map((item) => (
        <li key={item.id}>
          {onItemClick ? (
            <button type="button" className="dashboard-pills__pill" onClick={() => onItemClick(item)}>
              <span className="dashboard-pills__name" title={item.primary}>
                {item.primary}
              </span>
              <span className="dashboard-pills__count">({item.count ?? item.value ?? 0})</span>
            </button>
          ) : (
            <span className="dashboard-pills__pill dashboard-pills__pill--static">
              <span className="dashboard-pills__name" title={item.primary}>
                {item.primary}
              </span>
              <span className="dashboard-pills__count">({item.count ?? item.value ?? 0})</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
