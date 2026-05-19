import { EditRegular, CheckmarkRegular } from "@fluentui/react-icons";
import { useLayoutCustomization } from "./LayoutCustomizationContext.jsx";

export default function EditModeFab() {
  const { editMode, fieldEditMode, isRecordDetailView, toggleEditMode } = useLayoutCustomization();

  const hint =
    editMode && !isRecordDetailView
      ? "Open a record to customize form fields"
      : fieldEditMode
        ? "Done customizing layout"
        : "Customize form layout";

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
      <span>{editMode ? "Done" : "Customize"}</span>
    </button>
  );
}
