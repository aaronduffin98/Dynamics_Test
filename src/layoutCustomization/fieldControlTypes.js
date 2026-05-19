export const DEFAULT_CONTROL_TYPE = "text";

export const FIELD_CONTROL_TYPES = [
  { id: "text", label: "Single line text" },
  { id: "textarea", label: "Multi-line text" },
  { id: "dropdown", label: "Dropdown", needsOptions: true },
  { id: "phone", label: "Phone number" },
  { id: "email", label: "Email" },
  { id: "url", label: "Web link" },
  { id: "number", label: "Number" },
  { id: "currency", label: "Currency" },
  { id: "date", label: "Date" },
  { id: "checkbox", label: "Yes / No" },
];

const DROPDOWN_PRESETS = {
  status: ["Active", "Inactive", "Draft"],
  role: ["Sales Manager", "Sales Agent", "Administrator"],
  type: ["Apartment", "House", "Townhouse"],
};

export function isControlTypeLocked(field) {
  return Boolean(field?.lockControlType);
}

export function suggestedControlType(fieldId) {
  if (fieldId === "email") return "email";
  if (fieldId === "phone") return "phone";
  if (fieldId === "status" || fieldId === "role" || fieldId === "type") return "dropdown";
  if (fieldId.includes("Date") || fieldId === "createdOn") return "date";
  if (fieldId === "price" || fieldId === "totalUnits" || fieldId === "bedrooms") return "number";
  return DEFAULT_CONTROL_TYPE;
}

export function suggestedDropdownOptions(fieldId) {
  return DROPDOWN_PRESETS[fieldId] ?? ["Option 1", "Option 2", "Option 3"];
}

export function getEffectiveFieldControl(field, layout) {
  if (isControlTypeLocked(field)) return null;

  const stored = layout.fieldControls?.[field.id];
  if (stored?.type) return stored;

  if (field.isCustom && field.controlType) {
    return { type: field.controlType, options: field.controlOptions ?? [] };
  }

  return null;
}

export function isEmptyDisplayValue(value) {
  return value == null || String(value).trim() === "" || String(value).trim() === "—";
}

export function resolveDropdownDisplayValue(value, options = []) {
  if (!isEmptyDisplayValue(value)) return String(value).trim();
  if (options.length > 0) return options[0];
  return "—";
}

export function resolveFieldDisplayValue(field, record, context, layout) {
  const control = layout ? getEffectiveFieldControl(field, layout) : null;
  const options = control?.options ?? field.controlOptions ?? [];

  if (field.isCustom) {
    if (control?.type === "dropdown" || field.controlType === "dropdown") {
      return resolveDropdownDisplayValue(field.customValue, options);
    }
    return isEmptyDisplayValue(field.customValue) ? "—" : String(field.customValue);
  }

  if (typeof field.getDisplayValue === "function") {
    const raw = field.getDisplayValue(record, context);
    if (control?.type === "dropdown") {
      return resolveDropdownDisplayValue(raw, options);
    }
    return raw ?? "—";
  }

  return "—";
}
