import { Avatar } from "@fluentui/react-components";
import { ChevronRightRegular, DocumentRegular, MoreHorizontalRegular } from "@fluentui/react-icons";

export default function DashboardList({
  items,
  onItemClick,
  showMore = false,
  activityStyle = false,
}) {
  if (!items.length) {
    return (
      <div className="dashboard-list__empty">
        <DocumentRegular className="dashboard-list__empty-icon" aria-hidden="true" />
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="dashboard-list">
      <ul className="dashboard-list__items">
        {items.map((item) => (
          <li key={item.id} className="dashboard-list__item">
            {activityStyle ? (
              <ActivityListItem item={item} onItemClick={onItemClick} />
            ) : onItemClick ? (
              <button type="button" className="dashboard-list__row" onClick={() => onItemClick(item)}>
                <SimpleRow item={item} />
              </button>
            ) : (
              <div className="dashboard-list__row dashboard-list__row--static">
                <SimpleRow item={item} />
              </div>
            )}
          </li>
        ))}
      </ul>
      {showMore ? (
        <button type="button" className="dashboard-list__more">
          Show more
        </button>
      ) : null}
    </div>
  );
}

function SimpleRow({ item }) {
  return (
    <>
      <div className="dashboard-list__text">
        <span className="dashboard-list__primary">{item.primary}</span>
        {item.secondary ? <span className="dashboard-list__secondary">{item.secondary}</span> : null}
      </div>
      {item.meta || item.badge ? (
        <span className="dashboard-list__meta">{item.badge ?? item.meta}</span>
      ) : null}
    </>
  );
}

function ActivityListItem({ item, onItemClick }) {
  const Wrapper = onItemClick ? "button" : "div";
  const wrapperProps = onItemClick
    ? { type: "button", className: "dashboard-list__row dashboard-list__row--activity", onClick: () => onItemClick(item) }
    : { className: "dashboard-list__row dashboard-list__row--activity dashboard-list__row--static" };

  return (
    <div className="dashboard-list__activity-wrap">
      <Wrapper {...wrapperProps}>
        <div className="dashboard-list__activity-main">
          <div className="dashboard-list__activity-top">
            {item.overline ? <span className="dashboard-list__overline">{item.overline}</span> : null}
            {item.subline ? <span className="dashboard-list__subline">{item.subline}</span> : null}
          </div>
          <div className="dashboard-list__activity-body">
            {item.avatarName ? (
              <Avatar name={item.avatarName} size={32} color="colorful" className="dashboard-list__avatar" />
            ) : null}
            <div className="dashboard-list__activity-text">
              <span className="dashboard-list__primary">{item.primary}</span>
              {item.secondary ? <span className="dashboard-list__secondary">{item.secondary}</span> : null}
            </div>
          </div>
          {item.status ? (
            <div className="dashboard-list__status-row">
              <span className="dashboard-list__status">{item.status}</span>
              <ChevronRightRegular fontSize={12} className="dashboard-list__status-chevron" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      </Wrapper>
      <button type="button" className="dashboard-list__menu" aria-label="More options">
        <MoreHorizontalRegular fontSize={16} />
      </button>
    </div>
  );
}
