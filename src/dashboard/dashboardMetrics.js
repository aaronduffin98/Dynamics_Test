import {
  colorsForOrder,
  CONTRACT_STATUS_COLORS,
  DEVELOPMENT_STATUS_COLORS,
  CHART_COLOR_DEFAULT,
  PROPERTY_STATUS_COLORS,
} from "./chartColors.js";

export function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

export function mapToSeries(map, order, colors) {
  return order.map((label, i) => ({
    label,
    value: map.get(label) ?? 0,
    color: colors[i % colors.length],
  }));
}

export function countDevelopmentsByStatus(developments) {
  const order = ["Planning", "Active", "Completed"];
  const map = groupBy(developments, (d) => d.status);
  return mapToSeries(map, order, colorsForOrder(order, DEVELOPMENT_STATUS_COLORS));
}

export function countPropertiesByStatus(properties) {
  const order = ["Available", "Reserved", "Sold"];
  const map = groupBy(properties, (p) => p.status);
  return mapToSeries(map, order, colorsForOrder(order, PROPERTY_STATUS_COLORS));
}

export function countContractsByStatus(contracts) {
  const order = ["Draft", "Signed", "Completed"];
  const map = groupBy(contracts, (c) => c.status);
  return mapToSeries(map, order, colorsForOrder(order, CONTRACT_STATUS_COLORS));
}

/** Stacked bars: top buyers, segments = contract status (Dynamics Task Type by Owner). */
export function contractsStackedByBuyer(contracts, limit = 6) {
  const statusOrder = ["Draft", "Signed", "Completed"];
  const buyerMap = new Map();

  for (const c of contracts) {
    const key = c.buyerName;
    if (!buyerMap.has(key)) {
      buyerMap.set(key, { label: key, segments: Object.fromEntries(statusOrder.map((s) => [s, 0])) });
    }
    const row = buyerMap.get(key);
    row.segments[c.status] = (row.segments[c.status] ?? 0) + 1;
  }

  return [...buyerMap.values()]
    .map((row) => ({
      label: row.label,
      total: statusOrder.reduce((s, st) => s + (row.segments[st] ?? 0), 0),
      segments: statusOrder.map((st) => ({
        label: st,
        value: row.segments[st] ?? 0,
        color: CONTRACT_STATUS_COLORS[st] ?? CHART_COLOR_DEFAULT,
      })),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

const dateMedium = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const currencyFmt = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function recentContractsTableRows(contracts, limit = 8) {
  return [...contracts]
    .sort((a, b) => b.contractDate.getTime() - a.contractDate.getTime())
    .slice(0, limit)
    .map((c) => ({
      id: c.contractId,
      cells: {
        contractId: c.contractId,
        buyerName: c.buyerName,
        propertyLabel: c.propertyLabel,
        status: c.status,
        contractDate: dateMedium.format(c.contractDate),
      },
      linkColumn: "contractId",
    }));
}

export function availablePropertiesTableRows(properties, limit = 8) {
  return properties
    .filter((p) => p.status === "Available")
    .slice(0, limit)
    .map((p) => ({
      id: p.propertyId,
      cells: {
        propertyId: p.propertyId,
        developmentName: p.developmentName,
        type: p.type,
        status: p.status,
        price: currencyFmt.format(p.price),
      },
      linkColumn: "propertyId",
    }));
}

export function getQuarterDateRange(contracts) {
  if (!contracts.length) {
    return { label: "This quarter", range: "" };
  }
  const dates = contracts.map((c) => c.contractDate.getTime());
  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));
  const fmt = new Intl.DateTimeFormat(undefined, { dateStyle: "short" });
  return {
    label: "This quarter",
    range: `${fmt.format(min)} To ${fmt.format(max)}`,
  };
}
