import { useCallback, useMemo } from "react";
import { createTableColumn, TableCellLayout } from "@fluentui/react-components";
import GridColumnEditHeader from "./GridColumnEditHeader.jsx";
import { useLayoutCustomization } from "./LayoutCustomizationContext.jsx";

/**
 * @param {object} options
 * @param {string} options.entityKey
 * @param {string[]} options.defaultColumnIds
 * @param {Record<string, { label: string, compare?: Function, renderCell: Function }>} options.columnDefs
 * @param {{ sortColumn: string, sortDirection: string }} options.sortState
 * @param {Function} options.onSort
 * @param {Function} options.onMockCommand
 */
export default function useCustomizableGridColumns({
  entityKey,
  defaultColumnIds,
  columnDefs,
  sortState,
  onSort,
  onMockCommand,
}) {
  const {
    gridEditMode,
    layouts,
    getGridLayout,
    reorderGridColumns,
    restoreGridColumn,
    removeGridColumn,
    resetGridLayout,
  } = useLayoutCustomization();

  const sourceColumnIds = useMemo(() => Object.keys(columnDefs), [columnDefs]);

  const gridLayout = useMemo(
    () => getGridLayout(entityKey, defaultColumnIds),
    [layouts, entityKey, defaultColumnIds, getGridLayout],
  );

  const visibleColumnIds = useMemo(
    () => [...gridLayout.columnOrder],
    [gridLayout.columnOrder],
  );

  const columnIdsKey = useMemo(() => visibleColumnIds.join("|"), [visibleColumnIds]);

  const customColumnsKey = useMemo(
    () => gridLayout.customColumns.map((c) => `${c.id}:${c.label}:${c.value}`).join("|"),
    [gridLayout.customColumns],
  );

  const customById = useMemo(
    () => new Map(gridLayout.customColumns.map((c) => [c.id, c])),
    [customColumnsKey],
  );

  const handleColumnDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = visibleColumnIds.indexOf(active.id);
      const newIndex = visibleColumnIds.indexOf(over.id);
      if (oldIndex < 0 || newIndex < 0) return;
      reorderGridColumns(entityKey, defaultColumnIds, oldIndex, newIndex);
    },
    [visibleColumnIds, reorderGridColumns, entityKey, defaultColumnIds],
  );

  const handleRemoveColumn = useCallback(
    (columnId) => {
      removeGridColumn(entityKey, defaultColumnIds, columnId);
    },
    [removeGridColumn, entityKey, defaultColumnIds],
  );

  const addableColumns = useMemo(() => {
    const visibleSet = new Set(visibleColumnIds);
    return sourceColumnIds
      .filter((id) => !visibleSet.has(id) && columnDefs[id])
      .map((id) => ({ id, label: columnDefs[id].label }));
  }, [sourceColumnIds, visibleColumnIds, columnDefs]);

  const handleAddColumn = useCallback(
    (columnId) => {
      restoreGridColumn(entityKey, defaultColumnIds, columnId);
    },
    [restoreGridColumn, entityKey, defaultColumnIds],
  );

  const handleResetGridLayout = useCallback(() => {
    resetGridLayout(entityKey, defaultColumnIds);
  }, [resetGridLayout, entityKey, defaultColumnIds]);

  const columns = useMemo(() => {
    return visibleColumnIds
      .map((columnId) => {
        const custom = customById.get(columnId);
        if (custom) {
          const cellValue = custom.value;
          return createTableColumn({
            columnId: custom.id,
            compare: () => 0,
            renderHeaderCell: () => (
              <GridColumnEditHeader
                columnId={custom.id}
                label={custom.label}
                gridEditMode={gridEditMode}
                onRemove={handleRemoveColumn}
                sortState={sortState}
                onSort={onSort}
                onMockCommand={onMockCommand}
              />
            ),
            renderCell: (_item) => (
              <TableCellLayout truncate title={cellValue}>
                {cellValue}
              </TableCellLayout>
            ),
          });
        }

        const def = columnDefs[columnId];
        if (!def) return null;

        return createTableColumn({
          columnId,
          compare: def.compare,
          renderHeaderCell: () => (
            <GridColumnEditHeader
              columnId={columnId}
              label={def.label}
              gridEditMode={gridEditMode}
              onRemove={handleRemoveColumn}
              sortState={sortState}
              onSort={onSort}
              onMockCommand={onMockCommand}
            />
          ),
          renderCell: def.renderCell,
        });
      })
      .filter(Boolean);
  }, [
    columnIdsKey,
    customColumnsKey,
    columnDefs,
    gridEditMode,
    handleRemoveColumn,
    sortState,
    onSort,
    onMockCommand,
    customById,
  ]);

  return {
    columns,
    visibleColumnIds,
    columnIdsKey,
    gridEditMode,
    addableColumns,
    handleColumnDragEnd,
    handleAddColumn,
    handleResetGridLayout,
  };
}
