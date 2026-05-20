/**
 * Chart colors from Dynamics diary dashboard reference screenshot.
 * @see assets reference — pie/stacked bar palette
 */
export const DYNAMICS_CHART_PALETTE = [
  "#3182CE", /* medium blue — Administration */
  "#608221", /* olive / moss green */
  "#D6723E", /* orange-brown */
  "#D53F8C", /* pink / magenta */
  "#00A3C4", /* teal / cyan */
  "#B794F4", /* light purple */
  "#2B6CB0", /* darker blue */
  "#9AE6B4", /* light green */
];

export const CHART_COLOR = {
  blue: "#3182CE",
  green: "#608221",
  orange: "#D6723E",
  magenta: "#D53F8C",
  teal: "#00A3C4",
  purple: "#B794F4",
  navy: "#2B6CB0",
  mint: "#9AE6B4",
};

export const DEVELOPMENT_STATUS_COLORS = {
  Planning: CHART_COLOR.blue,
  Active: CHART_COLOR.green,
  Completed: CHART_COLOR.orange,
};

export const CONTRACT_STATUS_COLORS = {
  Draft: CHART_COLOR.blue,
  Signed: CHART_COLOR.green,
  Completed: CHART_COLOR.orange,
};

export const PROPERTY_STATUS_COLORS = {
  Available: CHART_COLOR.teal,
  Reserved: CHART_COLOR.magenta,
  Sold: CHART_COLOR.navy,
};

/** Default when a series index exceeds mapped keys */
export const CHART_COLOR_DEFAULT = CHART_COLOR.blue;

export function colorsForOrder(order, colorMap) {
  return order.map((key) => colorMap[key] ?? CHART_COLOR_DEFAULT);
}
