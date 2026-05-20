import { EditRegular, CheckmarkRegular } from "@fluentui/react-icons";
import { useLayoutCustomization } from "./LayoutCustomizationContext.jsx";

export default function EditModeFab() {
  const { editMode, fieldEditMode, gridEditMode, isRecordDetailView, isListView, toggleEditMode } =
    useLayoutCustomization();

  let hint = "Customize layout";
  let label = "Customize";

  if (gridEditMode) {
    hint = "Done customizing columns";
    label = "Done";
  } else if (fieldEditMode) {
    hint = "Done customizing layout";
    label = "Done";
  } else if (isListView) {
    hint = "Customize table columns";
    label = "Customize";
  } else if (isRecordDetailView) {
    hint = "Customize cards and fields";
    label = "Customize";
  } else if (editMode) {
    hint = "Open a list or record to customize layout";
    label = "Done";
  }

  return (
    <button
      type="button"
      className={`layout-edit-fab ${editMode ? "layout-edit-fab--active" : ""}`}
      onClick={toggleEditMode}
      aria-pressed={editMode}
      aria-label={hint}
      title={hint}
    >
      <span className="layout-edit-fab__icon" aria-hidden="true">
        {editMode ? <CheckmarkRegular /> : <EditRegular />}
      </span>
      <span>{label}</span>
    </button>
  );
}
