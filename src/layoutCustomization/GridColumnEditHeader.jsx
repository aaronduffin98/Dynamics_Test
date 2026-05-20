import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DeleteRegular, ReOrderDotsVerticalRegular } from "@fluentui/react-icons";
import { HeaderMenu } from "../dynamicsListViewHelpers.jsx";

export default function GridColumnEditHeader({
  columnId,
  label,
  gridEditMode,
  onRemove,
  sortState,
  onSort,
  onMockCommand,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: columnId,
    disabled: !gridEditMode,
  });

  if (!gridEditMode) {
    return (
      <HeaderMenu
        columnId={columnId}
        label={label}
        sortState={sortState}
        onSort={onSort}
        onMockCommand={onMockCommand}
      />
    );
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const wrapperClass = [
    "layout-edit-column",
    isDragging ? "layout-edit-column--dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={setNodeRef} style={style} className={wrapperClass}>
      <div className="layout-edit-column__chrome">
        <button
          type="button"
          className="layout-edit-column__handle"
          aria-label={`Drag to reorder ${label}`}
          {...attributes}
          {...listeners}
        >
          <ReOrderDotsVerticalRegular fontSize={16} />
        </button>
        <button
          type="button"
          className="layout-edit-column__delete"
          aria-label={`Remove column ${label}`}
          onClick={() => onRemove(columnId)}
        >
          <DeleteRegular fontSize={16} />
        </button>
      </div>
      <span className="layout-edit-column__label">{label}</span>
    </div>
  );
}
