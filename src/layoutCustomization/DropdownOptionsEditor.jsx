import { useRef, useState } from "react";
import { DismissRegular } from "@fluentui/react-icons";

export default function DropdownOptionsEditor({ options, onChange, idPrefix = "dropdown-options" }) {
  const [draft, setDraft] = useState("");
  const focusSnapshot = useRef(null);

  const addOption = () => {
    const trimmed = draft.trim();
    if (!trimmed || options.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...options, trimmed]);
    setDraft("");
  };

  const removeOption = (index) => {
    if (options.length <= 1) return;
    onChange(options.filter((_, i) => i !== index));
  };

  const updateOption = (index, raw) => {
    const next = [...options];
    next[index] = raw;
    onChange(next);
  };

  const commitOption = (index, raw) => {
    const trimmed = raw.trim();
    const snapshot = focusSnapshot.current ?? [...options];

    if (!trimmed) {
      onChange(snapshot);
      return;
    }

    if (options.some((o, i) => i !== index && o.trim() === trimmed)) {
      onChange(snapshot);
      return;
    }

    const next = [...options];
    next[index] = trimmed;
    onChange(next);
    focusSnapshot.current = next;
  };

  const handleAddKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addOption();
    }
  };

  const handleEditFocus = () => {
    focusSnapshot.current = [...options];
  };

  return (
    <div className="dropdown-options-editor">
      <span className="dropdown-options-editor__heading" id={`${idPrefix}-label`}>
        Dropdown options
      </span>
      <ul className="dropdown-options-editor__list" aria-labelledby={`${idPrefix}-label`}>
        {options.map((option, index) => (
          <li key={`${idPrefix}-option-${index}`} className="dropdown-options-editor__row">
            <input
              type="text"
              className="dropdown-options-editor__edit"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              onFocus={handleEditFocus}
              onBlur={(e) => commitOption(index, e.target.value)}
              aria-label={`Edit option ${index + 1}`}
            />
            <button
              type="button"
              className="dropdown-options-editor__remove"
              aria-label={`Remove option ${option || index + 1}`}
              disabled={options.length <= 1}
              onClick={() => removeOption(index)}
            >
              <DismissRegular fontSize={14} />
            </button>
          </li>
        ))}
      </ul>
      <div className="dropdown-options-editor__add">
        <input
          type="text"
          className="dropdown-options-editor__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleAddKeyDown}
          placeholder="New option…"
          aria-label="New dropdown option"
        />
        <button type="button" className="dropdown-options-editor__add-btn" onClick={addOption}>
          Add
        </button>
      </div>
    </div>
  );
}
