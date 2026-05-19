import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Input,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Popover,
  PopoverSurface,
  PopoverTrigger,
} from "@fluentui/react-components";
import {
  ArrowAutofitWidthRegular,
  ArrowDownRegular,
  ArrowLeftRegular,
  ArrowRightRegular,
  ArrowUpRegular,
  ChevronDownRegular,
  FilterRegular,
  GroupListRegular,
  SearchRegular,
  SettingsRegular,
} from "@fluentui/react-icons";

export const dynamicsListDateFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const SELECTION_COLUMN_WIDTH = 44;

/**
 * Full-width column sizing with draggable resize handles.
 * Fills the grid on load and window resize; widths the user sets are kept.
 */
export function useFillResizableColumnSizing(columnIds, options = {}) {
  const minWidth = options.minWidth ?? 80;
  const scrollRef = useRef(null);
  const userSizedRef = useRef(new Set());

  const [columnSizingOptions, setColumnSizingOptions] = useState(() =>
    Object.fromEntries(
      columnIds.map((id) => [id, { minWidth, defaultWidth: minWidth, idealWidth: minWidth }])
    )
  );

  const distributeWidths = useCallback(() => {
    const el = scrollRef.current;
    if (!el || columnIds.length === 0) return;

    const available = Math.max(
      columnIds.length * minWidth,
      el.clientWidth - SELECTION_COLUMN_WIDTH
    );

    setColumnSizingOptions((prev) => {
      const fixedTotal = columnIds
        .filter((id) => userSizedRef.current.has(id))
        .reduce(
          (sum, id) =>
            sum + (prev[id]?.idealWidth ?? prev[id]?.defaultWidth ?? minWidth),
          0
        );

      const flexIds = columnIds.filter((id) => !userSizedRef.current.has(id));
      if (flexIds.length === 0) return prev;

      const remaining = Math.max(flexIds.length * minWidth, available - fixedTotal);
      const each = Math.floor(remaining / flexIds.length);

      const next = { ...prev };
      let changed = false;
      for (const id of flexIds) {
        const w = Math.max(minWidth, each);
        if (prev[id]?.idealWidth !== w || prev[id]?.defaultWidth !== w) {
          changed = true;
          next[id] = { minWidth, defaultWidth: w, idealWidth: w };
        }
      }
      return changed ? next : prev;
    });
  }, [columnIds, minWidth]);

  useLayoutEffect(() => {
    distributeWidths();
    const el = scrollRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => distributeWidths());
    ro.observe(el);
    return () => ro.disconnect();
  }, [distributeWidths]);

  const onColumnResize = useCallback(
    (_event, { columnId, width }) => {
      userSizedRef.current.add(columnId);
      const w = Math.max(minWidth, width);
      setColumnSizingOptions((prev) => ({
        ...prev,
        [columnId]: { minWidth, defaultWidth: w, idealWidth: w },
      }));
    },
    [minWidth]
  );

  const resizableColumnsOptions = useMemo(() => ({ autoFitColumns: false }), []);

  return { scrollRef, columnSizingOptions, onColumnResize, resizableColumnsOptions };
}

/** Dynamics 365–style current view control: title + chevron, popover with search and saved views */
export function DynamicsViewTitlePicker({ views, selectedViewId, onSelectViewId, onManageViews }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = useMemo(
    () => views.find((v) => v.id === selectedViewId) ?? views[0],
    [views, selectedViewId]
  );
  const filteredViews = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return views;
    return views.filter((v) => v.label.toLowerCase().includes(q));
  }, [views, search]);

  const handleOpenChange = useCallback((_, data) => {
    setOpen(data.open);
    if (!data.open) setSearch("");
  }, []);

  return (
    <h1 className="dynamics-view-heading">
      <span className="dynamics-view-heading__inner">
        <Popover open={open} onOpenChange={handleOpenChange} positioning="below-start">
          <PopoverTrigger disableButtonEnhancement>
            <button
              type="button"
              className={`dynamics-view-title-trigger${open ? " dynamics-view-title-trigger--open" : ""}`}
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-controls={panelId}
            >
              <span className="dynamics-view-title-trigger__text">{selected.label}</span>
              <ChevronDownRegular className="dynamics-view-title-trigger__chevron" aria-hidden />
            </button>
          </PopoverTrigger>
          <PopoverSurface id={panelId} className="dynamics-view-picker">
            <div className="dynamics-view-picker__search">
              <Input
                className="dynamics-view-picker__search-input"
                placeholder="Search views"
                value={search}
                onChange={(_, d) => setSearch(d.value)}
                contentBefore={<SearchRegular className="dynamics-view-picker__search-icon" aria-hidden />}
                aria-label="Search views"
                size="small"
              />
            </div>
            <div className="dynamics-view-picker__list" role="listbox" aria-label="Saved views">
              {filteredViews.map((v) => {
                const isSelected = v.id === selectedViewId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`dynamics-view-picker__option${isSelected ? " dynamics-view-picker__option--selected" : ""}`}
                    onClick={() => {
                      onSelectViewId(v.id);
                      setOpen(false);
                    }}
                  >
                    <span className="dynamics-view-picker__check-wrap" aria-hidden>
                      {isSelected ? <span className="dynamics-view-picker__check">✓</span> : null}
                    </span>
                    <span className="dynamics-view-picker__option-label">{v.label}</span>
                    {v.isDefault ? <span className="dynamics-view-picker__default">Default</span> : null}
                  </button>
                );
              })}
            </div>
            <div className="dynamics-view-picker__footer">
              <button
                type="button"
                className="dynamics-view-picker__manage"
                onClick={() => {
                  setOpen(false);
                  onManageViews?.();
                }}
              >
                <SettingsRegular className="dynamics-view-picker__manage-icon" aria-hidden />
                Manage and share views
              </button>
            </div>
          </PopoverSurface>
        </Popover>
      </span>
    </h1>
  );
}

/** Dynamics-style column header — label + sort indicator + ⌄ menu (Sort / Group / Filter / Move) */
export function HeaderMenu({ columnId, label, sortState, onSort, onMockCommand }) {
  const isActive = sortState?.sortColumn === columnId;
  const direction = isActive ? sortState.sortDirection : null;
  const swallow = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  return (
    <span className="dynamics-header-cell">
      <span className="dynamics-header-cell__label" title={label}>
        {label}
      </span>
      {direction === "ascending" ? (
        <ArrowUpRegular
          className="dynamics-header-cell__sort-icon"
          fontSize={12}
          aria-hidden="true"
        />
      ) : direction === "descending" ? (
        <ArrowDownRegular
          className="dynamics-header-cell__sort-icon"
          fontSize={12}
          aria-hidden="true"
        />
      ) : null}
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          <button
            type="button"
            className="dynamics-header-cell__menu-trigger"
            aria-label={`${label} column options`}
            onClick={swallow}
            onMouseDown={swallow}
            onPointerDown={swallow}
          >
            <ChevronDownRegular fontSize={10} />
          </button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              icon={<ArrowUpRegular />}
              onClick={() => onSort(columnId, "ascending")}
            >
              A to Z
            </MenuItem>
            <MenuItem
              icon={<ArrowDownRegular />}
              onClick={() => onSort(columnId, "descending")}
            >
              Z to A
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<GroupListRegular />} onClick={onMockCommand}>
              Group by
            </MenuItem>
            <MenuItem icon={<FilterRegular />} onClick={onMockCommand}>
              Filter by
            </MenuItem>
            <MenuItem icon={<ArrowAutofitWidthRegular />} onClick={onMockCommand}>
              Column width
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<ArrowLeftRegular />} onClick={onMockCommand}>
              Move left
            </MenuItem>
            <MenuItem icon={<ArrowRightRegular />} onClick={onMockCommand}>
              Move right
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </span>
  );
}
