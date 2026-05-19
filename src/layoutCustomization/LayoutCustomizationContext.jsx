import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadAllLayouts, mergeLayout, saveAllLayouts } from "./layoutStorage.js";

const LayoutCustomizationContext = createContext(null);

export const DETAIL_VIEW_TYPES = new Set([
  "developmentDetail",
  "propertyDetail",
  "buyerDetail",
  "contractDetail",
  "salesStaffDetail",
]);

export function LayoutCustomizationProvider({ children, isRecordDetailView }) {
  const [editMode, setEditMode] = useState(false);
  const [layouts, setLayouts] = useState(() => loadAllLayouts());

  useEffect(() => {
    document.documentElement.classList.toggle("layout-edit-mode", editMode && isRecordDetailView);
    return () => document.documentElement.classList.remove("layout-edit-mode");
  }, [editMode, isRecordDetailView]);

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

  const fieldEditMode = editMode && isRecordDetailView;

  const value = useMemo(
    () => ({
      editMode,
      fieldEditMode,
      isRecordDetailView,
      toggleEditMode,
      getLayout,
      reorderFields,
      setFieldVisible,
      addCustomField,
      setFieldControlType,
      setCustomFieldValue,
      removeField,
      resetLayout,
    }),
    [
      editMode,
      fieldEditMode,
      isRecordDetailView,
      toggleEditMode,
      getLayout,
      reorderFields,
      setFieldVisible,
      addCustomField,
      setFieldControlType,
      setCustomFieldValue,
      removeField,
      resetLayout,
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
