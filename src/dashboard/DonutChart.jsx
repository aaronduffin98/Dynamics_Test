const SIZE = 100;
const STROKE = 12;

function ringPath(fraction, r) {
  const C = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, fraction));
  const dash = clamped * C;
  return { strokeDasharray: `${dash} ${C - dash}`, strokeDashoffset: C * 0.25 };
}

export function DonutChart({ value, total, label, color = "#0078d4", size = SIZE }) {
  const fraction = total > 0 ? value / total : 0;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - STROKE) / 2;
  const { strokeDasharray, strokeDashoffset } = ringPath(fraction, r);

  return (
    <div className="dashboard-donut" title={`${label}: ${value}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#edebe9" strokeWidth={STROKE} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
        />
      </svg>
      <div className="dashboard-donut__center">
        <span className="dashboard-donut__value">{value}</span>
        {label ? <span className="dashboard-donut__label">{label}</span> : null}
      </div>
    </div>
  );
}

export function DonutChartGroup({ series }) {
  const total = series.reduce((s, x) => s + x.value, 0);
  return (
    <div className="dashboard-donut-group">
      {series.map((item) => (
        <DonutChart
          key={item.label}
          value={item.value}
          total={total}
          label={item.label}
          color={item.color}
          size={88}
        />
      ))}
    </div>
  );
}

/** Pie-style card: horizontal legend on top, donut below (Dynamics Case Mix pattern). */
export function DonutWithLegend({ series }) {
  const total = series.reduce((s, x) => s + x.value, 0);
  const main = series.reduce((best, x) => (x.value > best.value ? x : best), series[0] ?? { value: 0 });

  return (
    <div className="dashboard-pie-card">
      <ul className="dashboard-pie-card__legend">
        {series.map((item) => (
          <li key={item.label}>
            <span className="dashboard-pie-card__dot" style={{ background: item.color }} aria-hidden="true" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="dashboard-pie-card__chart">
        <DonutChart value={main?.value ?? 0} total={total || 1} label="" color={main?.color ?? "#0078d4"} size={120} />
        <ul className="dashboard-pie-card__callouts" aria-hidden="true">
          {series
            .filter((s) => s.value > 0)
            .map((item, i) => (
              <li key={item.label} className={`dashboard-pie-card__callout dashboard-pie-card__callout--${i}`}>
                <span className="dashboard-pie-card__callout-line" />
                <span className="dashboard-pie-card__callout-value">{item.value}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
