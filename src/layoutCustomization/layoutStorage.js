const STORAGE_KEY = "dynamics-layout-customization";

export const BUILTIN_CARD_IDS = ["form", "timeline"];

/** Default page width: 2 = half (50%), 1 = full row */
const DEFAULT_CARD_WIDTHS = {
  form: 2,
  timeline: 2,
};

/** cardWidth 1 = full width row, 2 = half width (50%) */
export function normalizeCardWidth(value, fallback = 2) {
  if (value === 1) return 1;
  if (value === 2) return 2;
  return fallback === 1 ? 1 : 2;
}

/** Migrate legacy contentColumns / cardColumns to page cardWidth */
export function migrateLegacyToCardWidth(legacy) {
  if (legacy === 1) return 1;
  if (legacy === 2) return 2;
  return 2;
}

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

export function getDefaultPageLayout() {
  return {
    cardOrder: [...BUILTIN_CARD_IDS],
    hiddenCards: [],
    customCards: [],
    cardWidths: { ...DEFAULT_CARD_WIDTHS },
  };
}

function mergeCustomCardFields(fields) {
  return (fields ?? [])
    .filter((f) => f && typeof f.id === "string" && typeof f.label === "string")
    .map((f) => ({
      id: f.id,
      label: f.label,
      value: f.value ?? "—",
      controlType: f.controlType || "text",
      options: Array.isArray(f.options) ? f.options : [],
    }));
}

export function getCardWidth(pageLayout, cardId) {
  const custom = pageLayout.customCards?.find((c) => c.id === cardId);
  if (custom) return normalizeCardWidth(custom.cardWidth, 2);
  return normalizeCardWidth(
    pageLayout.cardWidths?.[cardId],
    DEFAULT_CARD_WIDTHS[cardId] ?? 2,
  );
}

export function mergePageLayout(stored) {
  const defaults = getDefaultPageLayout();
  if (!stored) return defaults;

  const customCards = (stored.customCards ?? [])
    .filter((c) => c && typeof c.id === "string" && typeof c.title === "string")
    .map((c) => {
      const fields = mergeCustomCardFields(c.fields);
      const fieldIds = new Set(fields.map((f) => f.id));
      const hiddenFields = (c.hiddenFields ?? []).filter((id) => fieldIds.has(id));
      const fieldControls = { ...(c.fieldControls ?? {}) };
      Object.keys(fieldControls).forEach((id) => {
        if (!fieldIds.has(id)) delete fieldControls[id];
      });
      return {
        id: c.id,
        title: c.title,
        cardWidth: normalizeCardWidth(
          c.cardWidth ??
            (c.contentColumns !== undefined ? migrateLegacyToCardWidth(c.contentColumns) : undefined),
          2,
        ),
        fields,
        hiddenFields,
        fieldControls,
      };
    });

  const customIds = customCards.map((c) => c.id);
  const knownIds = new Set([...BUILTIN_CARD_IDS, ...customIds]);

  const cardOrder = (stored.cardOrder ?? []).filter((id) => knownIds.has(id));
  BUILTIN_CARD_IDS.forEach((id) => {
    if (!cardOrder.includes(id)) cardOrder.push(id);
  });
  customIds.forEach((id) => {
    if (!cardOrder.includes(id)) cardOrder.push(id);
  });

  const hiddenCards = (stored.hiddenCards ?? []).filter((id) => knownIds.has(id));

  const cardWidths = { ...DEFAULT_CARD_WIDTHS };
  const storedWidths = stored.cardWidths ?? stored.cardColumns ?? {};
  BUILTIN_CARD_IDS.forEach((id) => {
    const legacy = storedWidths[id];
    if (legacy !== undefined) {
      cardWidths[id] = migrateLegacyToCardWidth(legacy);
    }
  });

  return {
    cardOrder,
    hiddenCards,
    customCards,
    cardWidths,
  };
}

export function getDefaultGridLayout(defaultColumnIds) {
  return {
    columnOrder: [...defaultColumnIds],
    removedColumns: [],
    customColumns: [],
  };
}

export function mergeGridLayout(stored, defaultColumnIds) {
  const defaults = getDefaultGridLayout(defaultColumnIds);
  if (!stored) return defaults;

  const customColumns = (stored.customColumns ?? [])
    .filter((c) => c && typeof c.id === "string" && typeof c.label === "string")
    .map((c) => ({
      id: c.id,
      label: c.label,
      value: c.value ?? "—",
    }));

  const customIds = customColumns.map((c) => c.id);
  const builtinSet = new Set(defaultColumnIds);
  const knownIds = new Set([...defaultColumnIds, ...customIds]);
  const removedSet = new Set(
    (stored.removedColumns ?? []).filter((id) => builtinSet.has(id)),
  );

  const columnOrder = (stored.columnOrder ?? []).filter((id) => knownIds.has(id) && !removedSet.has(id));
  defaultColumnIds.forEach((id) => {
    if (!removedSet.has(id) && !columnOrder.includes(id)) columnOrder.push(id);
  });
  customIds.forEach((id) => {
    if (!columnOrder.includes(id)) columnOrder.push(id);
  });

  return {
    columnOrder,
    removedColumns: [...removedSet],
    customColumns,
  };
}

export function getDefaultLayout(fieldIds) {
  return {
    order: [...fieldIds],
    hidden: [],
    customFields: [],
    removed: [],
    fieldControls: {},
    pageLayout: getDefaultPageLayout(),
    gridLayout: null,
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
    pageLayout: mergePageLayout(stored.pageLayout),
    gridLayout: stored.gridLayout ?? null,
  };
}
