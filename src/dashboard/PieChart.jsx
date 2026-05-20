const SIZE = 220;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 88;

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sliceLabelFill(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#323130" : "#ffffff";
}

function slicePath(cx, cy, r, startDeg, endDeg) {
  if (endDeg - startDeg >= 359.99) {
    return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`;
  }
  const start = polar(cx, cy, r, endDeg);
  const end = polar(cx, cy, r, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

export default function PieChart({ series, legendTitle }) {
  const total = series.reduce((s, x) => s + x.value, 0);
  if (total === 0) {
    return <p className="dashboard-chart-empty">No data available</p>;
  }

  let angle = 0;
  const slices = series
    .filter((s) => s.value > 0)
    .map((item) => {
      const sweep = (item.value / total) * 360;
      const start = angle;
      angle += sweep;
      const mid = start + sweep / 2;
      const labelPos = polar(CX, CY, R * 0.62, mid);
      return { ...item, start, end: start + sweep, mid, labelPos };
    });

  return (
    <div className="dashboard-pie-widget">
      <ul className="dashboard-pie-widget__legend" aria-label={legendTitle}>
        {series.map((item) => (
          <li key={item.label}>
            <span className="dashboard-pie-widget__dot" style={{ background: item.color }} aria-hidden="true" />
            <span>
              {item.label} ({item.value})
            </span>
          </li>
        ))}
      </ul>
      <div className="dashboard-pie-widget__chart">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Pie chart">
          {slices.map((slice) => (
            <path
              key={slice.label}
              d={slicePath(CX, CY, R, slice.start, slice.end)}
              fill={slice.color}
              stroke="#ffffff"
              strokeWidth={1}
            />
          ))}
          {slices.map((slice) =>
            slice.value > 0 ? (
              <text
                key={`${slice.label}-lbl`}
                x={slice.labelPos.x}
                y={slice.labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="dashboard-pie-widget__slice-label"
                fill={sliceLabelFill(slice.color)}
              >
                {slice.value}
              </text>
            ) : null,
          )}
        </svg>
      </div>
    </div>
  );
}
