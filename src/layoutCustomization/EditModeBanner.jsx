import { InfoRegular } from "@fluentui/react-icons";
import { useLayoutCustomization } from "./LayoutCustomizationContext.jsx";

/** Bottom-left status chip — same chrome as Customize FAB; exit via FAB (bottom-right). */
export default function EditModeBanner() {
  const { editMode, gridEditMode, fieldEditMode } = useLayoutCustomization();

  if (!editMode) {
    return null;
  }

  const shortLabel = "You are in edit mode now";
  const hint = gridEditMode
    ? "Editing table columns — drag headers to reorder, or use the toolbar to add columns."
    : fieldEditMode
      ? "Editing form layout — drag fields and cards to reorder."
      : "Open a list or record to customize columns and layout.";

  return (
    <div
      className="layout-edit-notice"
      role="status"
      aria-live="polite"
      aria-label={`${shortLabel}. ${hint}`}
      title={hint}
    >
      <span className="layout-edit-notice__icon" aria-hidden="true">
        <InfoRegular />
      </span>
      <span className="layout-edit-notice__text">{shortLabel}</span>
    </div>
  );
}
