import { CHART_COLOR_DEFAULT } from "./chartColors.js";

export default function StackedBarChart({ bars, yLabel = "Count (Status)" }) {
  if (!bars.length) {
    return <p className="dashboard-chart-empty">No data available</p>;
  }

  const maxTotal = Math.max(...bars.map((b) => b.total), 1);
  const tickMax = Math.ceil(maxTotal / 5) * 5 || 5;
  const ticks = [0, Math.round(tickMax / 2), tickMax];

  const legendLabels = bars[0]?.segments?.map((s) => s.label) ?? [];

  return (
    <div className="dashboard-stacked-chart">
      <ul className="dashboard-stacked-chart__legend">
        {legendLabels.map((label) => {
          const color = bars[0]?.segments.find((s) => s.label === label)?.color ?? CHART_COLOR_DEFAULT;
          return (
            <li key={label}>
              <span className="dashboard-stacked-chart__dot" style={{ background: color }} aria-hidden="true" />
              {label}
            </li>
          );
        })}
      </ul>
      <div className="dashboard-stacked-chart__plot-wrap">
        <div className="dashboard-stacked-chart__y-axis">
          <span className="dashboard-stacked-chart__ylabel">{yLabel}</span>
          <div className="dashboard-stacked-chart__ticks">
            {[...ticks].reverse().map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="dashboard-stacked-chart__plot">
          <div className="dashboard-stacked-chart__grid">
            {ticks.map((t) => (
              <div key={t} className="dashboard-stacked-chart__gridline" style={{ bottom: `${(t / tickMax) * 100}%` }} />
            ))}
          </div>
          <div className="dashboard-stacked-chart__bars">
            {bars.map((bar) => (
              <div key={bar.label} className="dashboard-stacked-chart__col" title={bar.label}>
                <div
                  className="dashboard-stacked-chart__stack"
                  style={{ height: `${(bar.total / tickMax) * 100}%` }}
                >
                  {bar.segments
                    .filter((seg) => seg.value > 0)
                    .map((seg) => (
                      <div
                        key={seg.label}
                        className="dashboard-stacked-chart__segment"
                        style={{ flexGrow: seg.value, background: seg.color }}
                      />
                    ))}
                </div>
                <span className="dashboard-stacked-chart__x-label">{truncate(bar.label, 14)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
}
