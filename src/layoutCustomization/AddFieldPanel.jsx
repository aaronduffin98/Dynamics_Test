import { useState } from "react";
import { AddRegular } from "@fluentui/react-icons";
import DropdownOptionsEditor from "./DropdownOptionsEditor.jsx";
import { DEFAULT_CONTROL_TYPE, FIELD_CONTROL_TYPES } from "./fieldControlTypes.js";

export default function AddFieldPanel({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [controlType, setControlType] = useState(DEFAULT_CONTROL_TYPE);
  const [dropdownOptions, setDropdownOptions] = useState(["Option 1", "Option 2"]);
  const [selectedValue, setSelectedValue] = useState("Option 1");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    const options = controlType === "dropdown" ? dropdownOptions : [];
    const fieldValue =
      controlType === "dropdown"
        ? selectedValue || dropdownOptions[0] || "—"
        : value.trim() || "—";
    onAdd(trimmed, fieldValue, controlType, options);
    setLabel("");
    setValue("");
    setControlType(DEFAULT_CONTROL_TYPE);
    setDropdownOptions(["Option 1", "Option 2"]);
    setSelectedValue("Option 1");
    setOpen(false);
  };

  if (!open) {
    return (
      <div className="layout-edit-add-field">
        <button type="button" className="layout-edit-add-field__btn" onClick={() => setOpen(true)}>
          <AddRegular fontSize={16} />
          Add field
        </button>
      </div>
    );
  }

  return (
    <div className="layout-edit-add-field">
      <form className="layout-edit-add-field__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Field label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          autoFocus
          aria-label="New field label"
        />
        {controlType !== "dropdown" ? (
          <input
            type="text"
            placeholder="Placeholder value (optional)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="New field placeholder value"
          />
        ) : null}
        <select
          className="layout-edit-add-field__select"
          value={controlType}
          onChange={(e) => {
            const next = e.target.value;
            setControlType(next);
            if (next === "dropdown" && dropdownOptions.length === 0) {
              setDropdownOptions(["Option 1", "Option 2"]);
            }
            if (next === "dropdown") {
              setSelectedValue(dropdownOptions[0] ?? "Option 1");
            }
          }}
          aria-label="New field control type"
        >
          {FIELD_CONTROL_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        {controlType === "dropdown" ? (
          <>
            <DropdownOptionsEditor
              options={dropdownOptions}
              onChange={(next) => {
                setDropdownOptions(next);
                if (!next.includes(selectedValue)) {
                  setSelectedValue(next[0] ?? "");
                }
              }}
              idPrefix="add-field"
            />
            {dropdownOptions.length > 0 ? (
              <label className="layout-edit-add-field__value-label">
                Displayed value
                <select
                  className="layout-edit-add-field__select"
                  value={dropdownOptions.includes(selectedValue) ? selectedValue : dropdownOptions[0]}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  aria-label="Displayed value for new field"
                >
                  {dropdownOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </>
        ) : null}
        <button type="submit" className="layout-edit-add-field__btn">
          Add
        </button>
        <button
          type="button"
          className="layout-edit-add-field__cancel"
          onClick={() => {
            setOpen(false);
            setLabel("");
            setValue("");
            setControlType(DEFAULT_CONTROL_TYPE);
            setDropdownOptions(["Option 1", "Option 2"]);
            setSelectedValue("Option 1");
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
