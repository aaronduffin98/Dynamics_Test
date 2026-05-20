import { useCallback, useMemo } from "react";
import { createTableColumn, TableCellLayout } from "@fluentui/react-components";
import GridColumnEditHeader from "./GridColumnEditHeader.jsx";
import { useLayoutCustomization } from "./LayoutCustomizationContext.jsx";

/**
 * @param {object} options
 * @param {string} options.entityKey
 * @param {string[]} options.defaultColumnIds
 * @param {string[]} [options.detailFieldIds] — builtin detail field ids (loads customFields from same entityKey)
 * @param {Record<string, { label: string, compare?: Function, renderCell: Function }>} options.columnDefs
 * @param {{ sortColumn: string, sortDirection: string }} options.sortState
 * @param {Function} options.onSort
 * @param {Function} options.onMockCommand
 */
export default function useCustomizableGridColumns({
  entityKey,
  defaultColumnIds,
  detailFieldIds = [],
  columnDefs,
  sortState,
  onSort,
  onMockCommand,
}) {
  const {
    gridEditMode,
    layouts,
    getLayout,
    getGridLayout,
    reorderGridColumns,
    addGridColumn,
    removeGridColumn,
    resetGridLayout,
  } = useLayoutCustomization();

  const sourceColumnIds = useMemo(() => Object.keys(columnDefs), [columnDefs]);

  const gridLayout = useMemo(
    () => getGridLayout(entityKey, defaultColumnIds),
    [layouts, entityKey, defaultColumnIds, getGridLayout],
  );

  const entityLayout = useMemo(
    () => getLayout(entityKey, detailFieldIds),
    [layouts, entityKey, detailFieldIds, getLayout],
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

  const detailCustomFieldsKey = useMemo(
    () => entityLayout.customFields.map((f) => `${f.id}:${f.label}:${f.value}`).join("|"),
    [entityLayout.customFields],
  );

  const customById = useMemo(
    () => new Map(gridLayout.customColumns.map((c) => [c.id, c])),
    [customColumnsKey],
  );

  const detailCustomById = useMemo(
    () => new Map(entityLayout.customFields.map((f) => [f.id, f])),
    [detailCustomFieldsKey],
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
    const seen = new Set();
    const result = [];

    sourceColumnIds.forEach((id) => {
      if (!visibleSet.has(id) && columnDefs[id] && !seen.has(id)) {
        seen.add(id);
        result.push({ id, label: columnDefs[id].label });
      }
    });

    entityLayout.customFields.forEach((f) => {
      if (!visibleSet.has(f.id) && !seen.has(f.id)) {
        seen.add(f.id);
        result.push({ id: f.id, label: f.label });
      }
    });

    gridLayout.customColumns.forEach((c) => {
      if (!visibleSet.has(c.id) && !seen.has(c.id)) {
        seen.add(c.id);
        result.push({ id: c.id, label: c.label });
      }
    });

    return result;
  }, [sourceColumnIds, visibleColumnIds, columnDefs, entityLayout.customFields, gridLayout.customColumns]);

  const handleAddColumn = useCallback(
    (columnId) => {
      addGridColumn(entityKey, defaultColumnIds, detailFieldIds, columnId);
    },
    [addGridColumn, entityKey, defaultColumnIds, detailFieldIds],
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

        const detailField = detailCustomById.get(columnId);
        if (detailField) {
          return createTableColumn({
            columnId: detailField.id,
            compare: () => 0,
            renderHeaderCell: () => (
              <GridColumnEditHeader
                columnId={detailField.id}
                label={detailField.label}
                gridEditMode={gridEditMode}
                onRemove={handleRemoveColumn}
                sortState={sortState}
                onSort={onSort}
                onMockCommand={onMockCommand}
              />
            ),
            renderCell: (item) => {
              const rowVal = item[columnId];
              const text =
                rowVal !== undefined && rowVal !== null
                  ? String(rowVal)
                  : (detailField.value ?? "—");
              return (
                <TableCellLayout truncate title={text}>
                  {text}
                </TableCellLayout>
              );
            },
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
    detailCustomFieldsKey,
    columnDefs,
    gridEditMode,
    handleRemoveColumn,
    sortState,
    onSort,
    onMockCommand,
    customById,
    detailCustomById,
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
