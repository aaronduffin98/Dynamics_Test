const STORAGE_KEY = "dynamics-layout-customization";

export function loadAllLayouts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveAllLayouts(layouts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  } catch {
    /* ignore quota errors in demo */
  }
}

export function getDefaultLayout(fieldIds) {
  return {
    order: [...fieldIds],
    hidden: [],
    customFields: [],
    removed: [],
    fieldControls: {},
  };
}

export function mergeLayout(entityKey, fieldIds, stored) {
  const defaults = getDefaultLayout(fieldIds);
  if (!stored) return defaults;

  const removedSet = new Set(stored.removed ?? []);
  const knownIds = new Set(fieldIds);
  const customIds = (stored.customFields ?? []).map((f) => f.id);
  customIds.forEach((id) => knownIds.add(id));

  const order = (stored.order ?? []).filter((id) => knownIds.has(id) && !removedSet.has(id));
  fieldIds.forEach((id) => {
    if (!removedSet.has(id) && !order.includes(id)) order.push(id);
  });
  customIds.forEach((id) => {
    if (!order.includes(id)) order.push(id);
  });

  const hidden = (stored.hidden ?? []).filter((id) => knownIds.has(id) && !removedSet.has(id));

  const removed = (stored.removed ?? []).filter(
    (id) => fieldIds.includes(id) || customIds.includes(id),
  );

  const fieldControls = { ...(stored.fieldControls ?? {}) };
  Object.keys(fieldControls).forEach((id) => {
    if (!knownIds.has(id) || removedSet.has(id)) delete fieldControls[id];
  });

  return {
    order,
    hidden,
    customFields: stored.customFields ?? [],
    removed,
    fieldControls,
  };
}
