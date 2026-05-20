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
  AddRegular,
  DeleteRegular,
  EyeOffRegular,
  EyeRegular,
  ReOrderDotsVerticalRegular,
} from "@fluentui/react-icons";
import CustomCardFieldSection from "./CustomCardFieldSection.jsx";
import { BUILTIN_CARD_IDS } from "./layoutStorage.js";
import { useLayoutCustomization } from "./LayoutCustomizationContext.jsx";

function widthSlotClass(cardWidth) {
  return cardWidth === 1
    ? "layout-card-slot--width-full"
    : "layout-card-slot--width-half";
}

function stopPickerEvent(e) {
  e.stopPropagation();
}

function CardWidthPicker({ cardId, cardWidth, onChange }) {
  return (
    <div
      className="layout-edit-card__columns"
      role="group"
      aria-label={`Page width for ${cardId}`}
      onPointerDown={stopPickerEvent}
      onClick={stopPickerEvent}
    >
      <button
        type="button"
        className={`layout-edit-card__col-btn${cardWidth === 1 ? " layout-edit-card__col-btn--active" : ""}`}
        aria-pressed={cardWidth === 1}
        title="Full width — spans the entire row"
        onPointerDown={stopPickerEvent}
        onClick={(e) => {
          stopPickerEvent(e);
          onChange(1);
        }}
      >
        Full width
      </button>
      <button
        type="button"
        className={`layout-edit-card__col-btn${cardWidth === 2 ? " layout-edit-card__col-btn--active" : ""}`}
        aria-pressed={cardWidth === 2}
        title="Half width — 50% of the row"
        onPointerDown={stopPickerEvent}
        onClick={(e) => {
          stopPickerEvent(e);
          onChange(2);
        }}
      >
        Half width
      </button>
    </div>
  );
}

function SortableCardShell({
  id,
  cardEditMode,
  isHidden,
  isBuiltin,
  title,
  cardWidth,
  slotClassName,
  isSplitTarget,
  onToggleVisibility,
  onDelete,
  onTitleChange,
  onCardWidthChange,
  children,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const wrapperClass = [
    "layout-edit-card",
    slotClassName,
    isHidden ? "layout-edit-card--hidden" : "",
    isDragging ? "layout-edit-card--dragging" : "",
    isSplitTarget ? "layout-edit-card--split-target" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!cardEditMode) {
    return <div className={`layout-edit-card__slot ${slotClassName}`}>{children}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} className={wrapperClass}>
      <div className="layout-edit-card__chrome">
        <button
          type="button"
          className="layout-edit-card__handle"
          aria-label={`Drag to reorder ${title}`}
          {...attributes}
          {...listeners}
        >
          <ReOrderDotsVerticalRegular fontSize={16} />
        </button>
        <CardWidthPicker cardId={id} cardWidth={cardWidth} onChange={onCardWidthChange} />
        {isBuiltin ? (
          <button
            type="button"
            className="layout-edit-card__visibility"
            aria-label={isHidden ? `Show ${title}` : `Hide ${title}`}
            onClick={() => onToggleVisibility(id)}
          >
            {isHidden ? <EyeRegular fontSize={16} /> : <EyeOffRegular fontSize={16} />}
          </button>
        ) : (
          <button
            type="button"
            className="layout-edit-card__delete"
            aria-label={`Remove ${title}`}
            onClick={() => onDelete(id)}
          >
            <DeleteRegular fontSize={16} />
          </button>
        )}
      </div>
      <div className="layout-edit-card__content">
        {!isBuiltin && onTitleChange ? (
          <div className="mda-custom-card__header">
            <FluentInput
              value={title}
              onChange={(_e, data) => onTitleChange(id, data.value)}
              className="mda-custom-card__title-input"
              aria-label="Card title"
            />
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

function renderCustomCard(card, entityKey) {
  return (
    <section className="mda-record-card mda-record-card--custom" aria-label={card.title}>
      {card.title ? (
        <header className="mda-custom-card__header mda-custom-card__header--view">
          <h3 className="mda-custom-card__title">{card.title}</h3>
        </header>
      ) : null}
      <CustomCardFieldSection entityKey={entityKey} cardId={card.id} />
    </section>
  );
}

export default function CustomizableCardGrid({ entityKey, cards }) {
  const {
    cardEditMode,
    getPageLayout,
    getCardWidth,
    reorderCards,
    setCardVisible,
    addCustomCard,
    updateCustomCardTitle,
    removeCustomCard,
    setCardWidth,
    splitRowWithCard,
    resetPageLayout,
  } = useLayoutCustomization();

  const [overCardId, setOverCardId] = useState(null);
  const [activeDragId, setActiveDragId] = useState(null);

  const pageLayout = getPageLayout(entityKey);
  const hiddenSet = useMemo(() => new Set(pageLayout.hiddenCards), [pageLayout.hiddenCards]);
  const customById = useMemo(
    () => new Map(pageLayout.customCards.map((c) => [c.id, c])),
    [pageLayout.customCards],
  );

  const resolvedCards = useMemo(() => {
    return pageLayout.cardOrder
      .map((id) => {
        const cardWidth = getCardWidth(entityKey, id);
        const slotClassName = widthSlotClass(cardWidth);

        if (BUILTIN_CARD_IDS.includes(id) && cards[id]) {
          return {
            id,
            isBuiltin: true,
            title: cards[id].label ?? id,
            render: cards[id].render,
            cardWidth,
            slotClassName,
          };
        }
        const custom = customById.get(id);
        if (custom) {
          return {
            id,
            isBuiltin: false,
            title: custom.title,
            cardWidth,
            slotClassName,
            render: () => renderCustomCard(custom, entityKey),
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [pageLayout, cards, customById, entityKey, getCardWidth]);

  const visibleCards = useMemo(
    () => (cardEditMode ? resolvedCards : resolvedCards.filter((c) => !hiddenSet.has(c.id))),
    [resolvedCards, cardEditMode, hiddenSet],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const clearDragState = () => {
    setOverCardId(null);
    setActiveDragId(null);
  };

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragOver = (event) => {
    setOverCardId(event.over?.id ?? null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    clearDragState();
    if (!over || active.id === over.id) return;

    const overWidth = getCardWidth(entityKey, over.id);
    if (overWidth === 1) {
      splitRowWithCard(entityKey, over.id, active.id);
      return;
    }

    const oldIndex = pageLayout.cardOrder.indexOf(active.id);
    const newIndex = pageLayout.cardOrder.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    reorderCards(entityKey, oldIndex, newIndex);
  };

  const handleDragCancel = () => {
    clearDragState();
  };

  const gridClass = [
    "mda-detail-record-grid",
    "mda-detail-record-grid--columns-2",
    cardEditMode ? "mda-detail-record-grid--edit" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const sortableIds = pageLayout.cardOrder;

  const gridContent = visibleCards.map((card) => {
    const isHidden = hiddenSet.has(card.id);

    if (!cardEditMode) {
      return (
        <div key={card.id} className={`layout-edit-card__slot ${card.slotClassName}`}>
          {card.isBuiltin ? card.render() : card.render()}
        </div>
      );
    }

    return (
      <SortableCardShell
        key={card.id}
        id={card.id}
        cardEditMode={cardEditMode}
        isHidden={isHidden}
        isBuiltin={card.isBuiltin}
        title={card.title}
        cardWidth={card.cardWidth}
        slotClassName={card.slotClassName}
        isSplitTarget={
          activeDragId !== null &&
          activeDragId !== card.id &&
          overCardId === card.id &&
          card.cardWidth === 1
        }
        onToggleVisibility={(cardId) => setCardVisible(entityKey, cardId, hiddenSet.has(cardId))}
        onDelete={(cardId) => removeCustomCard(entityKey, cardId)}
        onTitleChange={
          card.isBuiltin ? null : (cardId, title) => updateCustomCardTitle(entityKey, cardId, title)
        }
        onCardWidthChange={(width) => setCardWidth(entityKey, card.id, width)}
      >
        {card.isBuiltin ? (
          card.render()
        ) : (
          <section className="mda-record-card mda-record-card--custom" aria-label={card.title}>
            <CustomCardFieldSection entityKey={entityKey} cardId={card.id} />
          </section>
        )}
      </SortableCardShell>
    );
  });

  return (
    <div className="layout-card-grid-wrap">
      {cardEditMode ? (
        <div className="layout-edit-card-toolbar" role="toolbar" aria-label="Page layout">
          <button
            type="button"
            className="layout-edit-card-toolbar__btn"
            onClick={() => addCustomCard(entityKey)}
          >
            <AddRegular fontSize={16} />
            Add card
          </button>
          <button
            type="button"
            className="layout-edit-card-toolbar__reset"
            onClick={() => resetPageLayout(entityKey)}
          >
            Reset page layout
          </button>
        </div>
      ) : null}

      {cardEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
            <div className={gridClass}>{gridContent}</div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className={gridClass}>{gridContent}</div>
      )}
    </div>
  );
}
