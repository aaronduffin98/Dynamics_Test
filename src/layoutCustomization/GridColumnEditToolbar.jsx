import { useEffect, useState } from "react";
import { AddRegular } from "@fluentui/react-icons";

export default function GridColumnEditToolbar({ addableColumns = [], onAddColumn, onReset }) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const hasOptions = addableColumns.length > 0;

  useEffect(() => {
    if (!open) return;
    if (hasOptions && !addableColumns.some((c) => c.id === selectedId)) {
      setSelectedId(addableColumns[0].id);
    }
    if (!hasOptions) {
      setSelectedId("");
    }
  }, [open, hasOptions, addableColumns, selectedId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedId) return;
    onAddColumn(selectedId);
    setSelectedId("");
    setOpen(false);
  };

  return (
    <div className="layout-grid-edit-toolbar" role="toolbar" aria-label="Column layout">
      {!open ? (
        <button
          type="button"
          className="layout-grid-edit-toolbar__btn"
          onClick={() => {
            setOpen(true);
            if (addableColumns.length > 0) {
              setSelectedId(addableColumns[0].id);
            }
          }}
        >
          <AddRegular fontSize={16} />
          Add column
        </button>
      ) : (
        <form className="layout-grid-edit-toolbar__form" onSubmit={handleSubmit}>
          {hasOptions ? (
            <label className="layout-grid-edit-toolbar__field">
              <span className="layout-grid-edit-toolbar__field-label">Column</span>
              <select
                className="layout-grid-edit-toolbar__select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                aria-label="Select column to add"
              >
                {addableColumns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="layout-grid-edit-toolbar__empty">No columns available to add</p>
          )}
          <button
            type="submit"
            className="layout-grid-edit-toolbar__btn"
            disabled={!hasOptions || !selectedId}
          >
            Add
          </button>
          <button
            type="button"
            className="layout-grid-edit-toolbar__cancel"
            onClick={() => {
              setOpen(false);
              setSelectedId("");
            }}
          >
            Cancel
          </button>
        </form>
      )}
      <button type="button" className="layout-grid-edit-toolbar__reset" onClick={onReset}>
        Reset column layout
      </button>
    </div>
  );
}
