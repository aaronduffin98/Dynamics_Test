import { useCallback, useMemo, useState } from "react";
import {
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Input,
  TableCellLayout,
} from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowExportRegular,
  ArrowImportRegular,
  BookContactsRegular,
  BuildingRegular,
  ChevronDownRegular,
  ClockRegular,
  ColumnTripleEditRegular,
  DataBarVerticalRegular,
  DataPieRegular,
  DeleteRegular,
  DocumentBulletListRegular,
  DocumentRegular,
  DocumentTextRegular,
  FilterRegular,
  FlowRegular,
  HomeRegular,
  LineHorizontal3Regular,
  LinkRegular,
  PeopleRegular,
  PeopleTeamRegular,
  PersonAccountsRegular,
  PersonCircleRegular,
  PersonRegular,
  PinRegular,
  SearchRegular,
  SettingsRegular,
  ShareRegular,
  TableRegular,
} from "@fluentui/react-icons";
import {
  DynamicsViewTitlePicker,
  dynamicsListDateFmt as dateFmt,
  useFillResizableColumnSizing,
} from "./dynamicsListViewHelpers.jsx";
import GridColumnEditToolbar from "./layoutCustomization/GridColumnEditToolbar.jsx";
import GridHeaderDnD from "./layoutCustomization/GridHeaderDnD.jsx";
import { useLayoutCustomization } from "./layoutCustomization/LayoutCustomizationContext.jsx";
import { CONTRACT_DETAIL_FIELDS } from "./layoutCustomization/detailFieldConfigs.jsx";
import useCustomizableGridColumns from "./layoutCustomization/useCustomizableGridColumns.jsx";

const CONTRACT_DETAIL_FIELD_IDS = CONTRACT_DETAIL_FIELDS.map((f) => f.id);

const CONTRACT_COLUMN_IDS = [
  "contractId",
  "buyerName",
  "propertyLabel",
  "status",
  "contractDate",
];
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";

const CONTRACT_VIEWS = [
  { id: "all", label: "All Contracts", isDefault: true },
  { id: "draft", label: "Draft", isDefault: false },
  { id: "signed", label: "Signed", isDefault: false },
  { id: "completed", label: "Completed", isDefault: false },
  { id: "mine", label: "My contracts", isDefault: false },
];

export default function ContractsGrid({
  contracts,
  onOpenContract,
  onOpenNewContract,
  onNavigateHome,
  onNavigateDevelopments,
  onNavigateProperties,
  onNavigateBuyers,
  onNavigateContracts,
  onNavigateSalesStaff,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const [filter, setFilter] = useState("");
  const [sortState, setSortState] = useState({
    sortColumn: "contractDate",
    sortDirection: "descending",
  });
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [selectedViewId, setSelectedViewId] = useState(CONTRACT_VIEWS[0].id);

  const onMockCommand = useCallback(() => {
    /* No-op until wired to create/delete/refresh APIs */
  }, []);

  const handleColumnSort = useCallback((columnId, direction) => {
    setSortState({ sortColumn: columnId, sortDirection: direction });
  }, []);

  const filteredItems = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return contracts;
    return contracts.filter((row) =>
      [row.contractId, row.buyerName, row.buyerId, row.propertyLabel, row.propertyId, row.status, dateFmt.format(row.contractDate)].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [filter, contracts]);

  const { toggleEditMode, gridEditMode } = useLayoutCustomization();

  const columnDefs = useMemo(
    () => ({
      contractId: {
        label: "Contract ID",
        compare: (a, b) => a.contractId.localeCompare(b.contractId),
        renderCell: (item) => (
          <button
            type="button"
            className="dynamics-grid-link"
            onClick={(e) => {
              e.stopPropagation();
              onOpenContract?.(item.contractId);
            }}
            aria-label={`Open contract ${item.contractId}`}
          >
            {item.contractId}
          </button>
        ),
      },
      buyerName: {
        label: "Buyer",
        compare: (a, b) => a.buyerName.localeCompare(b.buyerName),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.buyerName}>
            {item.buyerName}
          </TableCellLayout>
        ),
      },
      propertyLabel: {
        label: "Property",
        compare: (a, b) => a.propertyLabel.localeCompare(b.propertyLabel),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.propertyLabel}>
            {item.propertyLabel}
          </TableCellLayout>
        ),
      },
      status: {
        label: "Status",
        compare: (a, b) => a.status.localeCompare(b.status),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.status}>
            {item.status}
          </TableCellLayout>
        ),
      },
      contractDate: {
        label: "Date",
        compare: (a, b) => a.contractDate.getTime() - b.contractDate.getTime(),
        renderCell: (item) => dateFmt.format(item.contractDate),
      },
    }),
    [onOpenContract],
  );

  const {
    columns,
    visibleColumnIds,
    addableColumns,
    handleColumnDragEnd,
    handleAddColumn,
    handleResetGridLayout,
  } = useCustomizableGridColumns({
    entityKey: "contract",
    defaultColumnIds: CONTRACT_COLUMN_IDS,
    detailFieldIds: CONTRACT_DETAIL_FIELD_IDS,
    columnDefs,
    sortState,
    onSort: handleColumnSort,
    onMockCommand,
  });

  const { scrollRef, columnSizingOptions, onColumnResize, resizableColumnsOptions } =
    useFillResizableColumnSizing(visibleColumnIds);

  return (
    <DynamicsAppShell
      activeNav="contracts"
      onNavigateHome={onNavigateHome}
      onNavigateDevelopments={onNavigateDevelopments}
      onNavigateProperties={onNavigateProperties}
      onNavigateBuyers={onNavigateBuyers}
      onNavigateContracts={onNavigateContracts}
      onNavigateSalesStaff={onNavigateSalesStaff}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
        <main className="dynamics-main">
          <div className="dynamics-main-surface">
            <div className="dynamics-surface-card dynamics-surface-card--command">
              <div className="dynamics-commandbar" role="toolbar" aria-label="Commands">
                <div className="dynamics-commandbar__scroll">
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — chart view">
                    <span className="dynamics-cmd-btn__inner">
                      <DataBarVerticalRegular className="dynamics-cmd-btn__icon" />
                      <span>Show Chart</span>
                    </span>
                  </Button>
                  <Button appearance="subtle" type="button" onClick={() => onOpenNewContract?.()} title="Create a new contract">
                    <span className="dynamics-cmd-btn__inner">
                      <AddRegular className="dynamics-cmd-btn__icon" />
                      <span>New</span>
                    </span>
                  </Button>
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — delete options">
                    <span className="dynamics-cmd-btn__inner">
                      <DeleteRegular className="dynamics-cmd-btn__icon" />
                      <span>Delete</span>
                      <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                    </span>
                  </Button>
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — refresh list">
                    <span className="dynamics-cmd-btn__inner">
                      <ArrowClockwiseRegular className="dynamics-cmd-btn__icon" />
                      <span>Refresh</span>
                    </span>
                  </Button>
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — Power BI visualize">
                    <span className="dynamics-cmd-btn__inner">
                      <DataPieRegular className="dynamics-cmd-btn__icon" />
                      <span>Visualize this view</span>
                    </span>
                  </Button>
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — email link">
                    <span className="dynamics-cmd-btn__inner">
                      <LinkRegular className="dynamics-cmd-btn__icon" />
                      <span>Email a Link</span>
                    </span>
                  </Button>
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — Power Automate">
                    <span className="dynamics-cmd-btn__inner">
                      <FlowRegular className="dynamics-cmd-btn__icon" />
                      <span>Flow</span>
                      <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                    </span>
                  </Button>
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — reporting">
                    <span className="dynamics-cmd-btn__inner">
                      <DocumentBulletListRegular className="dynamics-cmd-btn__icon" />
                      <span>Run Report</span>
                      <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                    </span>
                  </Button>
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — Excel templates">
                    <span className="dynamics-cmd-btn__inner">
                      <TableRegular className="dynamics-cmd-btn__icon" />
                      <span>Excel Templates</span>
                      <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                    </span>
                  </Button>
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — export">
                    <span className="dynamics-cmd-btn__inner">
                      <ArrowExportRegular className="dynamics-cmd-btn__icon" />
                      <span>Export to Excel</span>
                      <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                    </span>
                  </Button>
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — import">
                    <span className="dynamics-cmd-btn__inner">
                      <ArrowImportRegular className="dynamics-cmd-btn__icon" />
                      <span>Import from Excel</span>
                      <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                    </span>
                  </Button>
                </div>
                <div className="dynamics-commandbar__right">
                  <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — sharing">
                    <span className="dynamics-cmd-btn__inner">
                      <ShareRegular className="dynamics-cmd-btn__icon" />
                      <span>Share</span>
                      <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="dynamics-surface-card dynamics-surface-card--view">
              <section className="dynamics-view" aria-label="Contracts view">
                <div className="dynamics-view-toolbar">
                  <div className="dynamics-view-toolbar__title-wrap">
                    <DynamicsViewTitlePicker
                      views={CONTRACT_VIEWS}
                      selectedViewId={selectedViewId}
                      onSelectViewId={setSelectedViewId}
                      onManageViews={onMockCommand}
                    />
                  </div>
                  <div className="dynamics-view-toolbar__controls">
                    <button
                      type="button"
                      className={`dynamics-view-toolbar__link dynamics-view-toolbar__link--icon${gridEditMode ? " dynamics-view-toolbar__link--active" : ""}`}
                      onClick={toggleEditMode}
                      aria-pressed={gridEditMode}
                    >
                      <ColumnTripleEditRegular className="dynamics-view-toolbar__link-icon" aria-hidden="true" />
                      {gridEditMode ? "Done editing columns" : "Edit columns"}
                    </button>
                    <button type="button" className="dynamics-view-toolbar__link dynamics-view-toolbar__link--icon">
                      <FilterRegular className="dynamics-view-toolbar__link-icon" aria-hidden="true" />
                      Edit filters
                    </button>
                    <Input
                      className="dynamics-keyword-search"
                      placeholder="Filter by keyword"
                      value={filter}
                      onChange={(_, d) => setFilter(d.value)}
                      contentBefore={<SearchRegular className="dynamics-keyword-search__icon" aria-hidden />}
                      aria-label="Filter by keyword"
                    />
                  </div>
                </div>

                <div className="dynamics-grid-card">
                  {gridEditMode ? (
                    <GridColumnEditToolbar
                      addableColumns={addableColumns}
                      onAddColumn={handleAddColumn}
                      onReset={handleResetGridLayout}
                    />
                  ) : null}
                  <div
                    ref={scrollRef}
                    className="dynamics-grid-scroll dynamics-grid-scroll--list"
                  >
                    <div className="dynamics-grid-scroll__inner">
                      <DataGrid
                        items={filteredItems}
                        columns={columns}
                        sortable
                        sortState={sortState}
                        onSortChange={(_, next) => setSortState(next)}
                        resizableColumns
                        columnSizingOptions={columnSizingOptions}
                        onColumnResize={onColumnResize}
                        resizableColumnsOptions={resizableColumnsOptions}
                        selectionMode="multiselect"
                        selectionAppearance="neutral"
                        subtleSelection
                        selectedItems={selectedRows}
                        onSelectionChange={(_, data) => setSelectedRows(data.selectedItems)}
                        size="small"
                        getRowId={(item) => item.contractId}
                        focusMode="composite"
                        aria-label="Contracts — sortable, resizable columns"
                      >
                        <DataGridHeader>
                          <GridHeaderDnD
                            gridEditMode={gridEditMode}
                            sortableIds={visibleColumnIds}
                            onDragEnd={handleColumnDragEnd}
                          >
                            <DataGridRow selectionCell={{ "aria-label": "Select all rows" }}>
                              {({ renderHeaderCell }) => (
                                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                              )}
                            </DataGridRow>
                          </GridHeaderDnD>
                        </DataGridHeader>
                        <DataGridBody>
                          {({ item, rowId }) => (
                            <DataGridRow
                              key={rowId}
                              selectionCell={{ "aria-label": "Select row" }}
                              onDoubleClick={(e) => {
                                e.preventDefault();
                                onOpenContract?.(item.contractId);
                              }}
                            >
                              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                            </DataGridRow>
                          )}
                        </DataGridBody>
                      </DataGrid>
                      <footer className="dynamics-grid-footer">
                        <span className="dynamics-grid-footer__count">Rows: {filteredItems.length}</span>
                        {selectedRows.size > 0 ? (
                          <>
                            <span className="dynamics-grid-footer__divider" aria-hidden="true">
                              |
                            </span>
                            <span className="dynamics-grid-footer__count">{selectedRows.size} selected</span>
                          </>
                        ) : null}
                      </footer>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
    </DynamicsAppShell>
  );
}
