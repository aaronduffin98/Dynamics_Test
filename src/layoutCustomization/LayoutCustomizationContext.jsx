import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  BUILTIN_CARD_IDS,
  getCardWidth,
  getDefaultPageLayout,
  loadAllLayouts,
  mergeLayout,
  getDefaultGridLayout,
  mergeGridLayout,
  mergePageLayout,
  normalizeCardWidth,
  saveAllLayouts,
} from "./layoutStorage.js";

const LayoutCustomizationContext = createContext(null);

export const DETAIL_VIEW_TYPES = new Set([
  "developmentDetail",
  "propertyDetail",
  "buyerDetail",
  "contractDetail",
  "salesStaffDetail",
]);

export const LIST_VIEW_TYPES = new Set([
  "developments",
  "properties",
  "buyers",
  "contracts",
  "salesStaffList",
]);

export function LayoutCustomizationProvider({ children, isRecordDetailView, isListView = false }) {
  const [editMode, setEditMode] = useState(false);
  const [layouts, setLayouts] = useState(() => loadAllLayouts());

  useEffect(() => {
    document.documentElement.classList.toggle("layout-edit-mode", editMode && isRecordDetailView);
    return () => document.documentElement.classList.remove("layout-edit-mode");
  }, [editMode, isRecordDetailView]);

  useEffect(() => {
    document.documentElement.classList.toggle("layout-grid-edit-mode", editMode && isListView);
    return () => document.documentElement.classList.remove("layout-grid-edit-mode");
  }, [editMode, isListView]);

  const persistLayouts = useCallback((next) => {
    setLayouts(next);
    saveAllLayouts(next);
  }, []);

  const getLayout = useCallback(
    (entityKey, fieldIds) => mergeLayout(entityKey, fieldIds, layouts[entityKey]),
    [layouts],
  );

  const setLayout = useCallback(
    (entityKey, layout) => {
      persistLayouts({ ...layouts, [entityKey]: layout });
    },
    [layouts, persistLayouts],
  );

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  const reorderFields = useCallback(
    (entityKey, fieldIds, fromIndex, toIndex) => {
      const layout = getLayout(entityKey, fieldIds);
      const order = [...layout.order];
      const [moved] = order.splice(fromIndex, 1);
      order.splice(toIndex, 0, moved);
      setLayout(entityKey, { ...layout, order });
    },
    [getLayout, setLayout],
  );

  const setFieldVisible = useCallback(
    (entityKey, fieldIds, fieldId, visible) => {
      const layout = getLayout(entityKey, fieldIds);
      const hidden = new Set(layout.hidden);
      if (visible) hidden.delete(fieldId);
      else hidden.add(fieldId);
      setLayout(entityKey, { ...layout, hidden: [...hidden] });
    },
    [getLayout, setLayout],
  );

  const addCustomField = useCallback(
    (entityKey, fieldIds, label, value = "—", controlType = "text", options = []) => {
      const layout = getLayout(entityKey, fieldIds);
      const id = `custom-${Date.now()}`;
      const initialValue =
        controlType === "dropdown" && options.length > 0
          ? value && value !== "—" && options.includes(value)
            ? value
            : options[0]
          : value;

      const customField = {
        id,
        label,
        value: initialValue,
        controlType: controlType || "text",
        options: controlType === "dropdown" ? options : [],
      };
      const fieldControls = { ...layout.fieldControls };
      if (controlType && controlType !== "text") {
        fieldControls[id] = { type: controlType, options: controlType === "dropdown" ? options : [] };
      }
      setLayout(entityKey, {
        ...layout,
        customFields: [...layout.customFields, customField],
        order: [...layout.order, id],
        fieldControls,
      });
    },
    [getLayout, setLayout],
  );

  const setCustomFieldValue = useCallback(
    (entityKey, fieldIds, fieldId, value) => {
      const layout = getLayout(entityKey, fieldIds);
      const customIndex = layout.customFields.findIndex((f) => f.id === fieldId);
      if (customIndex < 0) return;

      const customFields = [...layout.customFields];
      customFields[customIndex] = { ...customFields[customIndex], value };
      setLayout(entityKey, { ...layout, customFields });
    },
    [getLayout, setLayout],
  );

  const setFieldControlType = useCallback(
    (entityKey, fieldIds, fieldId, type, options = []) => {
      const layout = getLayout(entityKey, fieldIds);
      const fieldControls = { ...layout.fieldControls };

      if (!type || type === "text") {
        delete fieldControls[fieldId];
      } else {
        fieldControls[fieldId] = {
          type,
          options: type === "dropdown" ? options : [],
        };
      }

      const next = { ...layout, fieldControls };
      const customIndex = layout.customFields.findIndex((f) => f.id === fieldId);
      if (customIndex >= 0) {
        const customFields = [...layout.customFields];
        const existing = customFields[customIndex];
        let nextValue = existing.value;
        if (type === "dropdown" && options.length > 0) {
          const trimmed = String(existing.value ?? "").trim();
          if (!trimmed || trimmed === "—" || !options.includes(trimmed)) {
            nextValue = options[0];
          }
        }
        customFields[customIndex] = {
          ...existing,
          value: nextValue,
          controlType: type || "text",
          options: type === "dropdown" ? options : [],
        };
        next.customFields = customFields;
      }

      setLayout(entityKey, next);
    },
    [getLayout, setLayout],
  );

  const removeField = useCallback(
    (entityKey, fieldIds, fieldId) => {
      const layout = getLayout(entityKey, fieldIds);
      const isCustom = layout.customFields.some((f) => f.id === fieldId);
      const isBuiltin = fieldIds.includes(fieldId);
      if (!isCustom && !isBuiltin) return;

      const removed = new Set(layout.removed ?? []);
      removed.add(fieldId);

      const fieldControls = { ...layout.fieldControls };
      delete fieldControls[fieldId];

      const next = {
        ...layout,
        removed: [...removed],
        order: layout.order.filter((id) => id !== fieldId),
        hidden: layout.hidden.filter((id) => id !== fieldId),
        fieldControls,
      };

      if (isCustom) {
        next.customFields = layout.customFields.filter((f) => f.id !== fieldId);
      }

      setLayout(entityKey, next);
    },
    [getLayout, setLayout],
  );

  const resetLayout = useCallback(
    (entityKey, fieldIds) => {
      const next = { ...layouts };
      delete next[entityKey];
      persistLayouts(next);
    },
    [layouts, persistLayouts],
  );

  const getPageLayout = useCallback(
    (entityKey) => mergePageLayout(layouts[entityKey]?.pageLayout),
    [layouts],
  );

  const setPageLayout = useCallback(
    (entityKey, pageLayout) => {
      const existing = layouts[entityKey] ?? {};
      persistLayouts({ ...layouts, [entityKey]: { ...existing, pageLayout } });
    },
    [layouts, persistLayouts],
  );

  const reorderCards = useCallback(
    (entityKey, fromIndex, toIndex) => {
      const pageLayout = getPageLayout(entityKey);
      const cardOrder = [...pageLayout.cardOrder];
      const [moved] = cardOrder.splice(fromIndex, 1);
      cardOrder.splice(toIndex, 0, moved);
      setPageLayout(entityKey, { ...pageLayout, cardOrder });
    },
    [getPageLayout, setPageLayout],
  );

  const setCardVisible = useCallback(
    (entityKey, cardId, visible) => {
      if (!BUILTIN_CARD_IDS.includes(cardId)) return;
      const pageLayout = getPageLayout(entityKey);
      const hiddenCards = new Set(pageLayout.hiddenCards);
      if (visible) hiddenCards.delete(cardId);
      else hiddenCards.add(cardId);
      setPageLayout(entityKey, { ...pageLayout, hiddenCards: [...hiddenCards] });
    },
    [getPageLayout, setPageLayout],
  );

  const addCustomCard = useCallback(
    (entityKey, title = "New section", cardWidth = 2) => {
      const pageLayout = getPageLayout(entityKey);
      const id = `card-${Date.now()}`;
      setPageLayout(entityKey, {
        ...pageLayout,
        customCards: [
          ...pageLayout.customCards,
          {
            id,
            title,
            cardWidth: normalizeCardWidth(cardWidth, 2),
            fields: [],
            hiddenFields: [],
            fieldControls: {},
          },
        ],
        cardOrder: [...pageLayout.cardOrder, id],
      });
      return id;
    },
    [getPageLayout, setPageLayout],
  );

  const updateCustomCardTitle = useCallback(
    (entityKey, cardId, title) => {
      const pageLayout = getPageLayout(entityKey);
      const customCards = pageLayout.customCards.map((c) =>
        c.id === cardId ? { ...c, title } : c,
      );
      setPageLayout(entityKey, { ...pageLayout, customCards });
    },
    [getPageLayout, setPageLayout],
  );

  const removeCustomCard = useCallback(
    (entityKey, cardId) => {
      const pageLayout = getPageLayout(entityKey);
      setPageLayout(entityKey, {
        ...pageLayout,
        customCards: pageLayout.customCards.filter((c) => c.id !== cardId),
        cardOrder: pageLayout.cardOrder.filter((id) => id !== cardId),
        hiddenCards: pageLayout.hiddenCards.filter((id) => id !== cardId),
      });
    },
    [getPageLayout, setPageLayout],
  );

  const getCardWidthForEntity = useCallback(
    (entityKey, cardId) => getCardWidth(getPageLayout(entityKey), cardId),
    [getPageLayout],
  );

  const setCardWidth = useCallback(
    (entityKey, cardId, width) => {
      const pageLayout = getPageLayout(entityKey);
      const cardWidth = normalizeCardWidth(width, 2);
      const custom = pageLayout.customCards.find((c) => c.id === cardId);
      if (custom) {
        const customCards = pageLayout.customCards.map((c) =>
          c.id === cardId ? { ...c, cardWidth } : c,
        );
        setPageLayout(entityKey, { ...pageLayout, customCards });
        return;
      }
      if (BUILTIN_CARD_IDS.includes(cardId)) {
        setPageLayout(entityKey, {
          ...pageLayout,
          cardWidths: { ...pageLayout.cardWidths, [cardId]: cardWidth },
        });
      }
    },
    [getPageLayout, setPageLayout],
  );

  const resetPageLayout = useCallback(
    (entityKey) => {
      const existing = layouts[entityKey] ?? {};
      persistLayouts({ ...layouts, [entityKey]: { ...existing, pageLayout: getDefaultPageLayout() } });
    },
    [layouts, persistLayouts],
  );

  const updateCustomCard = useCallback(
    (entityKey, cardId, updater) => {
      const pageLayout = getPageLayout(entityKey);
      const index = pageLayout.customCards.findIndex((c) => c.id === cardId);
      if (index < 0) return;
      const customCards = [...pageLayout.customCards];
      customCards[index] = updater(customCards[index]);
      setPageLayout(entityKey, { ...pageLayout, customCards });
    },
    [getPageLayout, setPageLayout],
  );

  const getCustomCardLayout = useCallback(
    (entityKey, cardId) => {
      const card = getPageLayout(entityKey).customCards.find((c) => c.id === cardId);
      if (!card) {
        return { fields: [], hiddenFields: [], fieldControls: {} };
      }
      return {
        fields: card.fields ?? [],
        hiddenFields: card.hiddenFields ?? [],
        fieldControls: card.fieldControls ?? {},
      };
    },
    [getPageLayout],
  );

  const addCustomCardField = useCallback(
    (entityKey, cardId, label, value = "—", controlType = "text", options = []) => {
      const id = `ccf-${Date.now()}`;
      const initialValue =
        controlType === "dropdown" && options.length > 0
          ? value && value !== "—" && options.includes(value)
            ? value
            : options[0]
          : value;

      updateCustomCard(entityKey, cardId, (card) => {
        const fieldControls = { ...(card.fieldControls ?? {}) };
        if (controlType && controlType !== "text") {
          fieldControls[id] = {
            type: controlType,
            options: controlType === "dropdown" ? options : [],
          };
        }
        const customField = {
          id,
          label,
          value: initialValue,
          controlType: controlType || "text",
          options: controlType === "dropdown" ? options : [],
        };
        return {
          ...card,
          fields: [...(card.fields ?? []), customField],
          fieldControls,
        };
      });
    },
    [updateCustomCard],
  );

  const setCustomCardFieldValue = useCallback(
    (entityKey, cardId, fieldId, value) => {
      updateCustomCard(entityKey, cardId, (card) => ({
        ...card,
        fields: (card.fields ?? []).map((f) => (f.id === fieldId ? { ...f, value } : f)),
      }));
    },
    [updateCustomCard],
  );

  const setCustomCardFieldControlType = useCallback(
    (entityKey, cardId, fieldId, type, options = []) => {
      updateCustomCard(entityKey, cardId, (card) => {
        const fieldControls = { ...(card.fieldControls ?? {}) };

        if (!type || type === "text") {
          delete fieldControls[fieldId];
        } else {
          fieldControls[fieldId] = {
            type,
            options: type === "dropdown" ? options : [],
          };
        }

        const fields = (card.fields ?? []).map((f) => {
          if (f.id !== fieldId) return f;
          let nextValue = f.value;
          if (type === "dropdown" && options.length > 0) {
            const trimmed = String(f.value ?? "").trim();
            if (!trimmed || trimmed === "—" || !options.includes(trimmed)) {
              nextValue = options[0];
            }
          }
          return {
            ...f,
            value: nextValue,
            controlType: type || "text",
            options: type === "dropdown" ? options : [],
          };
        });

        return { ...card, fields, fieldControls };
      });
    },
    [updateCustomCard],
  );

  const reorderCustomCardFields = useCallback(
    (entityKey, cardId, fromIndex, toIndex) => {
      updateCustomCard(entityKey, cardId, (card) => {
        const fields = [...(card.fields ?? [])];
        const [moved] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, moved);
        return { ...card, fields };
      });
    },
    [updateCustomCard],
  );

  const setCustomCardFieldVisible = useCallback(
    (entityKey, cardId, fieldId, visible) => {
      updateCustomCard(entityKey, cardId, (card) => {
        const hiddenFields = new Set(card.hiddenFields ?? []);
        if (visible) hiddenFields.delete(fieldId);
        else hiddenFields.add(fieldId);
        return { ...card, hiddenFields: [...hiddenFields] };
      });
    },
    [updateCustomCard],
  );

  const removeCustomCardField = useCallback(
    (entityKey, cardId, fieldId) => {
      updateCustomCard(entityKey, cardId, (card) => {
        const fieldControls = { ...(card.fieldControls ?? {}) };
        delete fieldControls[fieldId];
        return {
          ...card,
          fields: (card.fields ?? []).filter((f) => f.id !== fieldId),
          hiddenFields: (card.hiddenFields ?? []).filter((id) => id !== fieldId),
          fieldControls,
        };
      });
    },
    [updateCustomCard],
  );

  const setGridLayout = useCallback(
    (entityKey, gridLayout) => {
      const existing = layouts[entityKey] ?? {};
      persistLayouts({ ...layouts, [entityKey]: { ...existing, gridLayout } });
    },
    [layouts, persistLayouts],
  );

  const getGridLayout = useCallback(
    (entityKey, defaultColumnIds) => mergeGridLayout(layouts[entityKey]?.gridLayout, defaultColumnIds),
    [layouts],
  );

  const reorderGridColumns = useCallback(
    (entityKey, defaultColumnIds, fromIndex, toIndex) => {
      const gridLayout = getGridLayout(entityKey, defaultColumnIds);
      const columnOrder = [...gridLayout.columnOrder];
      const [moved] = columnOrder.splice(fromIndex, 1);
      columnOrder.splice(toIndex, 0, moved);
      setGridLayout(entityKey, { ...gridLayout, columnOrder });
    },
    [getGridLayout, setGridLayout],
  );

  const addCustomGridColumn = useCallback(
    (entityKey, defaultColumnIds, label, value = "—") => {
      const gridLayout = getGridLayout(entityKey, defaultColumnIds);
      const id = `col-${Date.now()}`;
      const customColumn = { id, label, value: value.trim() || "—" };
      setGridLayout(entityKey, {
        ...gridLayout,
        customColumns: [...gridLayout.customColumns, customColumn],
        columnOrder: [...gridLayout.columnOrder, id],
      });
    },
    [getGridLayout, setGridLayout],
  );

  const restoreGridColumn = useCallback(
    (entityKey, defaultColumnIds, columnId) => {
      if (!defaultColumnIds.includes(columnId)) return;
      const gridLayout = getGridLayout(entityKey, defaultColumnIds);
      if (gridLayout.columnOrder.includes(columnId)) return;

      const removedColumns = gridLayout.removedColumns.filter((id) => id !== columnId);
      const columnOrder = [...gridLayout.columnOrder, columnId];
      setGridLayout(entityKey, { ...gridLayout, columnOrder, removedColumns });
    },
    [getGridLayout, setGridLayout],
  );

  const removeGridColumn = useCallback(
    (entityKey, defaultColumnIds, columnId) => {
      const gridLayout = getGridLayout(entityKey, defaultColumnIds);
      const isCustom = gridLayout.customColumns.some((c) => c.id === columnId);
      const columnOrder = gridLayout.columnOrder.filter((id) => id !== columnId);

      if (isCustom) {
        setGridLayout(entityKey, {
          ...gridLayout,
          columnOrder,
          customColumns: gridLayout.customColumns.filter((c) => c.id !== columnId),
        });
        return;
      }

      if (!defaultColumnIds.includes(columnId)) return;

      const removedColumns = [...new Set([...gridLayout.removedColumns, columnId])];
      setGridLayout(entityKey, { ...gridLayout, columnOrder, removedColumns });
    },
    [getGridLayout, setGridLayout],
  );

  const resetGridLayout = useCallback(
    (entityKey, defaultColumnIds) => {
      const existing = layouts[entityKey] ?? {};
      persistLayouts({
        ...layouts,
        [entityKey]: { ...existing, gridLayout: getDefaultGridLayout(defaultColumnIds) },
      });
    },
    [layouts, persistLayouts],
  );

  const splitRowWithCard = useCallback(
    (entityKey, targetCardId, draggedCardId) => {
      if (targetCardId === draggedCardId) return;
      const pageLayout = getPageLayout(entityKey);
      const cardOrder = [...pageLayout.cardOrder];
      const draggedIdx = cardOrder.indexOf(draggedCardId);
      const targetIdx = cardOrder.indexOf(targetCardId);
      if (draggedIdx < 0 || targetIdx < 0) return;

      cardOrder.splice(draggedIdx, 1);
      const insertAt = cardOrder.indexOf(targetCardId) + 1;
      cardOrder.splice(insertAt, 0, draggedCardId);

      let customCards = [...pageLayout.customCards];
      const cardWidths = { ...pageLayout.cardWidths };

      const applyHalfWidth = (cardId) => {
        const customIndex = customCards.findIndex((c) => c.id === cardId);
        if (customIndex >= 0) {
          customCards[customIndex] = { ...customCards[customIndex], cardWidth: 2 };
        } else if (BUILTIN_CARD_IDS.includes(cardId)) {
          cardWidths[cardId] = 2;
        }
      };

      applyHalfWidth(targetCardId);
      applyHalfWidth(draggedCardId);

      setPageLayout(entityKey, { ...pageLayout, cardOrder, customCards, cardWidths });
    },
    [getPageLayout, setPageLayout],
  );

  const fieldEditMode = editMode && isRecordDetailView;
  const cardEditMode = fieldEditMode;
  const gridEditMode = editMode && isListView;

  const value = useMemo(
    () => ({
      editMode,
      fieldEditMode,
      cardEditMode,
      gridEditMode,
      isRecordDetailView,
      isListView,
      toggleEditMode,
      getLayout,
      reorderFields,
      setFieldVisible,
      addCustomField,
      setFieldControlType,
      setCustomFieldValue,
      removeField,
      resetLayout,
      getPageLayout,
      reorderCards,
      setCardVisible,
      addCustomCard,
      updateCustomCardTitle,
      removeCustomCard,
      getCardWidth: getCardWidthForEntity,
      setCardWidth,
      splitRowWithCard,
      resetPageLayout,
      getCustomCardLayout,
      addCustomCardField,
      setCustomCardFieldValue,
      setCustomCardFieldControlType,
      reorderCustomCardFields,
      setCustomCardFieldVisible,
      removeCustomCardField,
      getGridLayout,
      reorderGridColumns,
      addCustomGridColumn,
      restoreGridColumn,
      removeGridColumn,
      resetGridLayout,
      layouts,
    }),
    [
      editMode,
      fieldEditMode,
      cardEditMode,
      gridEditMode,
      isRecordDetailView,
      isListView,
      toggleEditMode,
      getLayout,
      reorderFields,
      setFieldVisible,
      addCustomField,
      setFieldControlType,
      setCustomFieldValue,
      removeField,
      resetLayout,
      getPageLayout,
      reorderCards,
      setCardVisible,
      addCustomCard,
      updateCustomCardTitle,
      removeCustomCard,
      getCardWidthForEntity,
      setCardWidth,
      splitRowWithCard,
      resetPageLayout,
      getCustomCardLayout,
      addCustomCardField,
      setCustomCardFieldValue,
      setCustomCardFieldControlType,
      reorderCustomCardFields,
      setCustomCardFieldVisible,
      removeCustomCardField,
      getGridLayout,
      reorderGridColumns,
      addCustomGridColumn,
      restoreGridColumn,
      removeGridColumn,
      resetGridLayout,
      layouts,
    ],
  );

  return (
    <LayoutCustomizationContext.Provider value={value}>{children}</LayoutCustomizationContext.Provider>
  );
}

export function useLayoutCustomization() {
  const ctx = useContext(LayoutCustomizationContext);
  if (!ctx) {
    throw new Error("useLayoutCustomization must be used within LayoutCustomizationProvider");
  }
  return ctx;
}
