import { useMemo, useState } from "react";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input as FluentInput } from "@fluentui/react-components";
import {
  DeleteRegular,
  EyeOffRegular,
  EyeRegular,
  ReOrderDotsVerticalRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import AddFieldPanel from "./AddFieldPanel.jsx";
import DropdownOptionsEditor from "./DropdownOptionsEditor.jsx";
import FieldControlRenderer from "./FieldControlRenderer.jsx";
import {
  DEFAULT_CONTROL_TYPE,
  FIELD_CONTROL_TYPES,
  getEffectiveFieldControl,
  isControlTypeLocked,
  isEmptyDisplayValue,
  resolveFieldDisplayValue,
  suggestedControlType,
  suggestedDropdownOptions,
} from "./fieldControlTypes.js";
import DetailRow from "../detailRecord/DetailRow.jsx";
import { useLayoutCustomization } from "./LayoutCustomizationContext.jsx";

function renderControl(field, record, context, layout) {
  if (isControlTypeLocked(field)) {
    return field.isCustom ? (
      <FluentInput readOnly value={field.customValue ?? "—"} className="mda-input" />
    ) : (
      field.render(record, context)
    );
  }

  const control = getEffectiveFieldControl(field, layout);
  if (control?.type) {
    const value = resolveFieldDisplayValue(field, record, context, layout);
    return (
      <FieldControlRenderer
        type={control.type}
        value={value}
        options={control.options ?? []}
      />
    );
  }

  return field.isCustom ? (
    <FluentInput readOnly value={field.customValue ?? "—"} className="mda-input" />
  ) : (
    field.render(record, context)
  );
}

function FieldTypePanel({ field, layout, onApply, onSetCustomValue }) {
  const current = getEffectiveFieldControl(field, layout);
  const [type, setType] = useState(current?.type ?? suggestedControlType(field.id));
  const [options, setOptions] = useState(
    () => current?.options ?? suggestedDropdownOptions(field.id),
  );

  const selectedValue =
    field.isCustom && !isEmptyDisplayValue(field.customValue)
      ? field.customValue
      : options[0] ?? "";

  const handleTypeChange = (nextType) => {
    setType(nextType);
    const nextOptions =
      nextType === "dropdown"
        ? options.length > 0
          ? options
          : suggestedDropdownOptions(field.id)
        : [];
    if (nextType === "dropdown" && options.length === 0) {
      setOptions(nextOptions);
    }
    onApply(field.id, nextType === DEFAULT_CONTROL_TYPE ? null : nextType, nextOptions);
  };

  const handleOptionsChange = (nextOptions) => {
    setOptions(nextOptions);
    if (type === "dropdown") {
      onApply(field.id, type, nextOptions);
      if (field.isCustom && onSetCustomValue) {
        const currentVal = field.customValue;
        const nextVal =
          currentVal && nextOptions.includes(currentVal) ? currentVal : nextOptions[0] ?? "—";
        if (nextVal !== currentVal) onSetCustomValue(field.id, nextVal);
      }
    }
  };

  return (
    <div className="layout-edit-field-type-panel">
      <label className="layout-edit-field-type-panel__label">
        Control type
        <select
          className="layout-edit-field-type-panel__select"
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          aria-label={`Control type for ${field.label}`}
        >
          {FIELD_CONTROL_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      {type === "dropdown" ? (
        <>
          <DropdownOptionsEditor
            options={options}
            onChange={handleOptionsChange}
            idPrefix={`field-type-${field.id}`}
          />
          {field.isCustom && onSetCustomValue && options.length > 0 ? (
            <label className="layout-edit-field-type-panel__label">
              Displayed value
              <select
                className="layout-edit-field-type-panel__select"
                value={options.includes(selectedValue) ? selectedValue : options[0]}
                onChange={(e) => onSetCustomValue(field.id, e.target.value)}
                aria-label={`Displayed value for ${field.label}`}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function ViewFieldRow({ field, record, context, layout, isHidden }) {
  if (isHidden) return null;
  return (
    <DetailRow label={field.label} required={field.required}>
      {renderControl(field, record, context, layout)}
    </DetailRow>
  );
}

function SortableFieldRow({
  id,
  field,
  record,
  context,
  layout,
  isHidden,
  onToggleVisibility,
  onDelete,
  onSetControlType,
  onSetCustomValue,
}) {
  const [typePanelOpen, setTypePanelOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const canCustomizeControl = !isControlTypeLocked(field);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const wrapperClass = [
    "layout-edit-field",
    isHidden ? "layout-edit-field--hidden" : "",
    isDragging ? "layout-edit-field--dragging" : "",
    typePanelOpen ? "layout-edit-field--type-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={setNodeRef} style={style} className={wrapperClass}>
        <button
          type="button"
          className="layout-edit-field__handle"
          aria-label={`Drag to reorder ${field.label}`}
          {...attributes}
          {...listeners}
        >
          <ReOrderDotsVerticalRegular fontSize={16} />
        </button>
        <DetailRow label={field.label} required={field.required}>
          {renderControl(field, record, context, layout)}
        </DetailRow>
        {canCustomizeControl ? (
          <button
            type="button"
            className={`layout-edit-field__settings${typePanelOpen ? " layout-edit-field__settings--active" : ""}`}
            aria-label={`Change control type for ${field.label}`}
            aria-expanded={typePanelOpen}
            onClick={() => setTypePanelOpen((o) => !o)}
          >
            <SettingsRegular fontSize={16} />
          </button>
        ) : null}
        <button
          type="button"
          className="layout-edit-field__delete"
          aria-label={`Delete ${field.label}`}
          onClick={() => onDelete(id)}
        >
          <DeleteRegular fontSize={16} />
        </button>
        <button
          type="button"
          className="layout-edit-field__visibility"
          aria-label={isHidden ? `Show ${field.label}` : `Hide ${field.label}`}
          onClick={() => onToggleVisibility(id)}
        >
          {isHidden ? <EyeRegular fontSize={16} /> : <EyeOffRegular fontSize={16} />}
        </button>
      {canCustomizeControl && typePanelOpen ? (
        <FieldTypePanel
          key={`${field.id}-${JSON.stringify(layout.fieldControls?.[field.id] ?? {})}`}
          field={field}
          layout={layout}
          onApply={(fieldId, controlType, options) => {
            onSetControlType(fieldId, controlType ?? DEFAULT_CONTROL_TYPE, options);
          }}
          onSetCustomValue={onSetCustomValue}
        />
      ) : null}
    </div>
  );
}

function buildRows({
  resolvedFields,
  hiddenSet,
  editMode,
  record,
  context,
  layout,
  onToggleVisibility,
  onDelete,
  onSetControlType,
  onSetCustomValue,
}) {
  let lastSection = null;
  const rows = [];

  resolvedFields.forEach((field) => {
    const isHidden = hiddenSet.has(field.id);

    if (field.section && field.section !== lastSection && (editMode || !isHidden)) {
      rows.push(
        <p
          key={`section-${field.section}`}
          className={`mda-form-section__title${lastSection ? "" : " mda-form-section__title--first"}`}
        >
          {field.sectionLabel}
        </p>,
      );
      lastSection = field.section;
    } else if (!field.section) {
      lastSection = null;
    }

    if (editMode) {
      rows.push(
        <SortableFieldRow
          key={field.id}
          id={field.id}
          field={field}
          record={record}
          context={context}
          layout={layout}
          isHidden={isHidden}
          onToggleVisibility={onToggleVisibility}
          onDelete={onDelete}
          onSetControlType={onSetControlType}
          onSetCustomValue={onSetCustomValue}
        />,
      );
    } else {
      rows.push(
        <ViewFieldRow
          key={field.id}
          field={field}
          record={record}
          context={context}
          layout={layout}
          isHidden={isHidden}
        />,
      );
    }
  });

  return rows;
}

export default function CustomizableFieldSection({ entityKey, record, fields, context = {} }) {
  const {
    fieldEditMode,
    getLayout,
    reorderFields,
    setFieldVisible,
    addCustomField,
    setFieldControlType,
    setCustomFieldValue,
    removeField,
    resetLayout,
  } = useLayoutCustomization();

  const fieldMap = useMemo(() => {
    const map = new Map();
    fields.forEach((f) => map.set(f.id, f));
    return map;
  }, [fields]);

  const baseFieldIds = useMemo(() => fields.map((f) => f.id), [fields]);
  const layout = getLayout(entityKey, baseFieldIds);
  const hiddenSet = useMemo(() => new Set(layout.hidden), [layout.hidden]);

  const resolvedFields = useMemo(() => {
    const customById = new Map((layout.customFields ?? []).map((c) => [c.id, c]));
    return layout.order
      .map((id) => {
        const base = fieldMap.get(id);
        if (base) return { ...base, isCustom: false };
        const custom = customById.get(id);
        if (custom) {
          return {
            id: custom.id,
            label: custom.label,
            isCustom: true,
            customValue: custom.value,
            controlType: custom.controlType,
            controlOptions: custom.options,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [layout.order, layout.customFields, fieldMap]);

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
    reorderFields(entityKey, baseFieldIds, oldIndex, newIndex);
  };

  const handleToggleVisibility = (fieldId) => {
    setFieldVisible(entityKey, baseFieldIds, fieldId, hiddenSet.has(fieldId));
  };

  const handleDeleteField = (fieldId) => {
    removeField(entityKey, baseFieldIds, fieldId);
  };

  const handleSetControlType = (fieldId, type, options) => {
    setFieldControlType(entityKey, baseFieldIds, fieldId, type, options);
  };

  const handleSetCustomValue = (fieldId, value) => {
    setCustomFieldValue(entityKey, baseFieldIds, fieldId, value);
  };

  const rows = buildRows({
    resolvedFields,
    hiddenSet,
    editMode: fieldEditMode,
    record,
    context,
    layout,
    onToggleVisibility: handleToggleVisibility,
    onDelete: handleDeleteField,
    onSetControlType: handleSetControlType,
    onSetCustomValue: handleSetCustomValue,
  });

  const sortableIds = resolvedFields.map((f) => f.id);

  if (fieldEditMode) {
    return (
      <div className="mda-detail-columns">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
            {rows}
          </SortableContext>
          <AddFieldPanel
            onAdd={(label, value, controlType, options) =>
              addCustomField(entityKey, baseFieldIds, label, value, controlType, options)
            }
          />
          <button
            type="button"
            className="layout-edit-reset"
            onClick={() => resetLayout(entityKey, baseFieldIds)}
          >
            Reset layout to default
          </button>
        </DndContext>
      </div>
    );
  }

  return <div className="mda-detail-columns">{rows}</div>;
}
