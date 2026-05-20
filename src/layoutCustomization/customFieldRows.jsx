import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DeleteRegular,
  EyeOffRegular,
  EyeRegular,
  ReOrderDotsVerticalRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import DropdownOptionsEditor from "./DropdownOptionsEditor.jsx";
import {
  DEFAULT_CONTROL_TYPE,
  FIELD_CONTROL_TYPES,
  getEffectiveFieldControl,
  isControlTypeLocked,
  isEmptyDisplayValue,
  suggestedControlType,
  suggestedDropdownOptions,
} from "./fieldControlTypes.js";
import DetailRow from "../detailRecord/DetailRow.jsx";

export { DetailRow };

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

export function ViewFieldRow({ field, layout, isHidden, renderControl }) {
  if (isHidden) return null;
  return (
    <DetailRow label={field.label} required={field.required}>
      {renderControl(field, layout)}
    </DetailRow>
  );
}

export function SortableFieldRow({
  id,
  field,
  layout,
  isHidden,
  renderControl,
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
        {renderControl(field, layout)}
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

export function buildCustomFieldRows({
  resolvedFields,
  hiddenSet,
  editMode,
  layout,
  renderControl,
  onToggleVisibility,
  onDelete,
  onSetControlType,
  onSetCustomValue,
}) {
  const rows = [];

  resolvedFields.forEach((field) => {
    const isHidden = hiddenSet.has(field.id);

    if (editMode) {
      rows.push(
        <SortableFieldRow
          key={field.id}
          id={field.id}
          field={field}
          layout={layout}
          isHidden={isHidden}
          renderControl={renderControl}
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
          layout={layout}
          isHidden={isHidden}
          renderControl={renderControl}
        />,
      );
    }
  });

  return rows;
}
