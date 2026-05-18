function maxIdFromRows(rows, pattern, fallback) {
  let max = fallback;
  for (const row of rows) {
    const key = Object.keys(row).find((k) => k.endsWith("Id"));
    const id = key ? row[key] : row;
    const m = pattern.exec(id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max;
}

export function allocateDevelopmentId(existing) {
  const max = maxIdFromRows(existing, /^DEV-(\d+)$/, 10000);
  return `DEV-${String(max + 1).padStart(5, "0")}`;
}

export function allocatePropertyId(existing) {
  const max = maxIdFromRows(existing, /^PRP-(\d+)$/, 50000);
  return `PRP-${String(max + 1).padStart(5, "0")}`;
}

export function allocateBuyerId(existing) {
  const max = maxIdFromRows(existing, /^BUY-(\d+)$/, 70000);
  return `BUY-${String(max + 1).padStart(5, "0")}`;
}

export function allocateContractId(existing) {
  const max = maxIdFromRows(existing, /^CTR-(\d+)$/, 60000);
  return `CTR-${String(max + 1).padStart(5, "0")}`;
}

export function allocateSalesStaffId(existing) {
  const max = maxIdFromRows(existing, /^SLS-(\d+)$/, 31000);
  return `SLS-${String(max + 1).padStart(5, "0")}`;
}
