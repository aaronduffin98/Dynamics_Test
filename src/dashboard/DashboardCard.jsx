import {
  ChevronDownRegular,
  ArrowSortRegular,
  ClipboardTextLtrRegular,
  GridRegular,
  MailRegular,
  WrenchRegular,
} from "@fluentui/react-icons";

const LIST_ICONS = {
  wrench: WrenchRegular,
  mail: MailRegular,
  clipboard: ClipboardTextLtrRegular,
};

export default function DashboardCard({
  title,
  variant = "chart",
  filterState,
  recordCount,
  sortLabel = "Modified On",
  listIcon = "wrench",
  children,
  className = "",
}) {
  const Icon = LIST_ICONS[listIcon] ?? WrenchRegular;
  const isList = variant === "list";

  return (
    <section className={`dashboard-card dashboard-card--${variant} ${className}`.trim()}>
      <header className="dashboard-card__header">
        <div className="dashboard-card__title-row">
          <h2 className="dashboard-card__title">{title}</h2>
          {isList && filterState ? (
            <span className="dashboard-card__filter-state">{filterState}</span>
          ) : null}
        </div>
        {isList ? (
          <div className="dashboard-card__utility" role="toolbar" aria-label={`${title} options`}>
            <span className="dashboard-card__utility-left">
              <Icon className="dashboard-card__utility-icon" aria-hidden="true" />
              <span className="dashboard-card__utility-count">{recordCount ?? 0}</span>
              <ArrowSortRegular className="dashboard-card__utility-sort" aria-hidden="true" />
              <button type="button" className="dashboard-card__sort-btn">
                Sort By
                <span className="dashboard-card__sort-field">{sortLabel}</span>
                <ChevronDownRegular fontSize={10} aria-hidden="true" />
              </button>
            </span>
            <button type="button" className="dashboard-card__see-all" aria-label="See all records">
              <GridRegular aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </header>
      <div className="dashboard-card__body">{children}</div>
    </section>
  );
}
