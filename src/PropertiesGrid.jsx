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
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
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
  useFillResizableColumnSizing,
} from "./dynamicsListViewHelpers.jsx";
import GridColumnEditToolbar from "./layoutCustomization/GridColumnEditToolbar.jsx";
import GridHeaderDnD from "./layoutCustomization/GridHeaderDnD.jsx";
import { useLayoutCustomization } from "./layoutCustomization/LayoutCustomizationContext.jsx";
import { PROPERTY_DETAIL_FIELDS } from "./layoutCustomization/detailFieldConfigs.jsx";
import useCustomizableGridColumns from "./layoutCustomization/useCustomizableGridColumns.jsx";

const PROPERTY_DETAIL_FIELD_IDS = PROPERTY_DETAIL_FIELDS.map((f) => f.id);

const PROPERTY_COLUMN_IDS = [
  "propertyId",
  "developmentName",
  "type",
  "bedrooms",
  "price",
  "status",
];
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";

const PROPERTY_VIEWS = [
  { id: "active", label: "Active listings", isDefault: true },
  { id: "flagged", label: "Properties — flagged", isDefault: false },
  { id: "lastMonth", label: "Properties added last month", isDefault: false },
  { id: "older", label: "Listed 90+ days", isDefault: false },
  { id: "inactive", label: "Sold properties", isDefault: false },
  { id: "mine", label: "My properties", isDefault: false },
];

const priceFmt = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export default function PropertiesGrid({
  properties,
  onOpenProperty,
  onOpenNewProperty,
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
    sortColumn: "price",
    sortDirection: "descending",
  });
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [selectedViewId, setSelectedViewId] = useState(PROPERTY_VIEWS[0].id);

  const onMockCommand = useCallback(() => {
    /* No-op until wired to create/delete/refresh APIs */
  }, []);

  const handleColumnSort = useCallback((columnId, direction) => {
    setSortState({ sortColumn: columnId, sortDirection: direction });
  }, []);

  const enrichedProperties = useMemo(() => properties.map((p) => ({ ...p })), [properties]);

  const filteredItems = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return enrichedProperties;
    return enrichedProperties.filter((row) =>
      [
        row.propertyId,
        row.developmentName,
        row.type,
        String(row.bedrooms ?? ""),
        priceFmt.format(row.price ?? 0),
        row.status,
      ].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [filter, enrichedProperties]);

  const { toggleEditMode, gridEditMode } = useLayoutCustomization();

  const columnDefs = useMemo(
    () => ({
      propertyId: {
        label: "Property ID",
        compare: (a, b) => a.propertyId.localeCompare(b.propertyId),
        renderCell: (item) => (
          <button
            type="button"
            className="dynamics-grid-link"
            onClick={(e) => {
              e.stopPropagation();
              onOpenProperty?.(item.propertyId);
            }}
            aria-label={`Open property ${item.propertyId}`}
          >
            {item.propertyId}
          </button>
        ),
      },
      developmentName: {
        label: "Development",
        compare: (a, b) => a.developmentName.localeCompare(b.developmentName),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.developmentName}>
            {item.developmentName}
          </TableCellLayout>
        ),
      },
      type: {
        label: "Type",
        compare: (a, b) => a.type.localeCompare(b.type),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.type}>
            {item.type}
          </TableCellLayout>
        ),
      },
      bedrooms: {
        label: "Bedrooms",
        compare: (a, b) => (a.bedrooms ?? 0) - (b.bedrooms ?? 0),
        renderCell: (item) => (
          <TableCellLayout truncate title={String(item.bedrooms ?? "")}>
            {item.bedrooms ?? "—"}
          </TableCellLayout>
        ),
      },
      price: {
        label: "Price",
        compare: (a, b) => (a.price ?? 0) - (b.price ?? 0),
        renderCell: (item) => {
          const label = priceFmt.format(item.price ?? 0);
          return (
            <TableCellLayout truncate title={label}>
              {label}
            </TableCellLayout>
          );
        },
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
    }),
    [onOpenProperty],
  );

  const {
    columns,
    visibleColumnIds,
    addableColumns,
    handleColumnDragEnd,
    handleAddColumn,
    handleResetGridLayout,
  } = useCustomizableGridColumns({
    entityKey: "property",
    defaultColumnIds: PROPERTY_COLUMN_IDS,
    detailFieldIds: PROPERTY_DETAIL_FIELD_IDS,
    columnDefs,
    sortState,
    onSort: handleColumnSort,
    onMockCommand,
  });

  const { scrollRef, columnSizingOptions, onColumnResize, resizableColumnsOptions } =
    useFillResizableColumnSizing(visibleColumnIds);

  return (
    <DynamicsAppShell
      activeNav="properties"
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
                  <Button
                    appearance="subtle"
                    type="button"
                    onClick={() => onOpenNewProperty?.()}
                    title="Create a new property"
                  >
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
              <section className="dynamics-view" aria-label="Properties view">
                <div className="dynamics-view-toolbar">
                  <div className="dynamics-view-toolbar__title-wrap">
                    <DynamicsViewTitlePicker
                      views={PROPERTY_VIEWS}
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
                  <div ref={scrollRef} className="dynamics-grid-scroll dynamics-grid-scroll--list">
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
                        getRowId={(item) => item.propertyId}
                        focusMode="composite"
                        aria-label="Properties — sortable, resizable columns"
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
                                onOpenProperty?.(item.propertyId);
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
