import { useMemo } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Input as FluentInput } from "@fluentui/react-components";
import AddFieldPanel from "./AddFieldPanel.jsx";
import FieldControlRenderer from "./FieldControlRenderer.jsx";
import { DEFAULT_CONTROL_TYPE, getEffectiveFieldControl } from "./fieldControlTypes.js";
import { useLayoutCustomization } from "./LayoutCustomizationContext.jsx";
import { buildCustomFieldRows } from "./customFieldRows.jsx";

function renderCustomFieldControl(field, layout) {
  const control = getEffectiveFieldControl(field, layout);
  if (control?.type) {
    return (
      <FieldControlRenderer
        type={control.type}
        value={field.customValue ?? "—"}
        options={control.options ?? []}
      />
    );
  }
  return <FluentInput readOnly value={field.customValue ?? "—"} className="mda-input" />;
}

export default function CustomCardFieldSection({ entityKey, cardId }) {
  const {
    fieldEditMode,
    getCustomCardLayout,
    addCustomCardField,
    setCustomCardFieldValue,
    setCustomCardFieldControlType,
    reorderCustomCardFields,
    setCustomCardFieldVisible,
    removeCustomCardField,
  } = useLayoutCustomization();

  const cardLayout = getCustomCardLayout(entityKey, cardId);
  const hiddenSet = useMemo(
    () => new Set(cardLayout.hiddenFields),
    [cardLayout.hiddenFields],
  );

  const layout = useMemo(
    () => ({
      fieldControls: cardLayout.fieldControls,
    }),
    [cardLayout.fieldControls],
  );

  const resolvedFields = useMemo(
    () =>
      (cardLayout.fields ?? []).map((f) => ({
        id: f.id,
        label: f.label,
        isCustom: true,
        customValue: f.value,
        controlType: f.controlType,
        controlOptions: f.options,
      })),
    [cardLayout.fields],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = resolvedFields.findIndex((f) => f.id === active.id);
    const newIndex = resolvedFields.findIndex((f) => f.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    reorderCustomCardFields(entityKey, cardId, oldIndex, newIndex);
  };

  const handleToggleVisibility = (fieldId) => {
    setCustomCardFieldVisible(entityKey, cardId, fieldId, hiddenSet.has(fieldId));
  };

  const handleDeleteField = (fieldId) => {
    removeCustomCardField(entityKey, cardId, fieldId);
  };

  const handleSetControlType = (fieldId, type, options) => {
    setCustomCardFieldControlType(
      entityKey,
      cardId,
      fieldId,
      type === DEFAULT_CONTROL_TYPE ? null : type,
      options,
    );
  };

  const handleSetCustomValue = (fieldId, value) => {
    setCustomCardFieldValue(entityKey, cardId, fieldId, value);
  };

  const renderControl = (field) => renderCustomFieldControl(field, layout);

  const rows = buildCustomFieldRows({
    resolvedFields,
    hiddenSet,
    editMode: fieldEditMode,
    layout,
    renderControl,
    onToggleVisibility: handleToggleVisibility,
    onDelete: handleDeleteField,
    onSetControlType: handleSetControlType,
    onSetCustomValue: handleSetCustomValue,
  });

  const sortableIds = resolvedFields.map((f) => f.id);

  if (fieldEditMode) {
    return (
      <div className="mda-custom-card__body mda-detail-columns">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
            {rows}
          </SortableContext>
          <AddFieldPanel
            onAdd={(label, value, controlType, options) =>
              addCustomCardField(entityKey, cardId, label, value, controlType, options)
            }
          />
        </DndContext>
      </div>
    );
  }

  if (resolvedFields.length === 0) {
    return (
      <div className="mda-custom-card__body mda-custom-card__body--empty">
        <p className="mda-custom-card__empty-text">No fields added</p>
      </div>
    );
  }

  return <div className="mda-custom-card__body mda-detail-columns">{rows}</div>;
}
