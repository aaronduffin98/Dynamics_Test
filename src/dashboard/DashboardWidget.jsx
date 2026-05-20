import {
  ArrowClockwiseRegular,
  ChevronDownRegular,
  FullScreenMaximizeRegular,
  TableRegular,
} from "@fluentui/react-icons";

export default function DashboardWidget({
  title,
  subtitle,
  children,
  className = "",
  span = 1,
}) {
  return (
    <section
      className={`dashboard-widget ${span === 2 ? "dashboard-widget--wide" : ""} ${className}`.trim()}
    >
      <header className="dashboard-widget__header">
        <div className="dashboard-widget__head-row">
          <button type="button" className="dashboard-widget__title-btn">
            <span className="dashboard-widget__title">{title}</span>
            <ChevronDownRegular className="dashboard-widget__title-chevron" aria-hidden="true" />
          </button>
          <div className="dashboard-widget__toolbar" role="toolbar" aria-label={`${title} actions`}>
            <button type="button" className="dashboard-widget__tool-btn" aria-label="Refresh" title="Refresh">
              <ArrowClockwiseRegular fontSize={16} />
            </button>
            <button type="button" className="dashboard-widget__tool-btn" aria-label="View records" title="View records">
              <TableRegular fontSize={16} />
            </button>
            <button type="button" className="dashboard-widget__tool-btn" aria-label="Expand" title="Expand">
              <FullScreenMaximizeRegular fontSize={16} />
            </button>
          </div>
        </div>
        {subtitle ? <p className="dashboard-widget__subtitle">{subtitle}</p> : null}
      </header>
      <div className="dashboard-widget__body">{children}</div>
    </section>
  );
}
