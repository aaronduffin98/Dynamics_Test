export default function BarChart({ series, yLabel = "Count:All" }) {
  const maxVal = Math.max(...series.map((s) => s.value), 1);
  const tickMax = Math.ceil(maxVal / 5) * 5 || 5;
  const ticks = [0, Math.round(tickMax / 2), tickMax];

  return (
    <div className="dashboard-bar-chart">
      <div className="dashboard-bar-chart__axis-wrap">
        <span className="dashboard-bar-chart__ylabel">{yLabel}</span>
        <div className="dashboard-bar-chart__y-ticks">
          {[...ticks].reverse().map((t) => (
            <span key={t} className="dashboard-bar-chart__tick">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="dashboard-bar-chart__plot-area">
        <div className="dashboard-bar-chart__grid">
          {ticks.map((t) => (
            <div
              key={t}
              className="dashboard-bar-chart__gridline"
              style={{ bottom: `${(t / tickMax) * 100}%` }}
            />
          ))}
        </div>
        <div className="dashboard-bar-chart__plot">
          {series.map((item) => (
            <div key={item.label} className="dashboard-bar-chart__col">
              <div className="dashboard-bar-chart__bar-wrap">
                <div
                  className="dashboard-bar-chart__bar"
                  style={{
                    height: `${(item.value / tickMax) * 100}%`,
                    background: item.color ?? "#0078d4",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard-bar-chart__x-labels">
          {series.map((item) => (
            <span key={item.label} className="dashboard-bar-chart__label">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
