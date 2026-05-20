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
import { BUYER_DETAIL_FIELDS } from "./layoutCustomization/detailFieldConfigs.jsx";
import useCustomizableGridColumns from "./layoutCustomization/useCustomizableGridColumns.jsx";

const BUYER_DETAIL_FIELD_IDS = BUYER_DETAIL_FIELDS.map((f) => f.id);

const BUYER_COLUMN_IDS = [
  "buyerId",
  "fullName",
  "email",
  "phone",
  "interestedDevelopmentName",
];
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";

const BUYER_VIEWS = [
  { id: "active", label: "Active buyers", isDefault: true },
  { id: "flagged", label: "Buyers — flagged", isDefault: false },
  { id: "lastMonth", label: "Buyers added last month", isDefault: false },
  { id: "older", label: "No contact 30+ days", isDefault: false },
  { id: "inactive", label: "Closed leads", isDefault: false },
  { id: "mine", label: "My buyers", isDefault: false },
];

export default function BuyersGrid({
  buyers,
  onOpenBuyer,
  onOpenNewBuyer,
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
    sortColumn: "fullName",
    sortDirection: "ascending",
  });
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [selectedViewId, setSelectedViewId] = useState(BUYER_VIEWS[0].id);

  const onMockCommand = useCallback(() => {
    /* No-op until wired to create/delete/refresh APIs */
  }, []);

  const handleColumnSort = useCallback((columnId, direction) => {
    setSortState({ sortColumn: columnId, sortDirection: direction });
  }, []);

  const enrichedBuyers = useMemo(() => buyers.map((b) => ({ ...b })), [buyers]);

  const filteredItems = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return enrichedBuyers;
    return enrichedBuyers.filter((row) =>
      [row.buyerId, row.fullName, row.email, row.phone, row.interestedDevelopmentName].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [filter, enrichedBuyers]);

  const { toggleEditMode, gridEditMode } = useLayoutCustomization();

  const columnDefs = useMemo(
    () => ({
      buyerId: {
        label: "Buyer ID",
        compare: (a, b) => a.buyerId.localeCompare(b.buyerId),
        renderCell: (item) => (
          <button
            type="button"
            className="dynamics-grid-link"
            onClick={(e) => {
              e.stopPropagation();
              onOpenBuyer?.(item.buyerId);
            }}
            aria-label={`Open buyer ${item.buyerId}`}
          >
            {item.buyerId}
          </button>
        ),
      },
      fullName: {
        label: "Name",
        compare: (a, b) => a.fullName.localeCompare(b.fullName),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.fullName}>
            {item.fullName}
          </TableCellLayout>
        ),
      },
      email: {
        label: "Email",
        compare: (a, b) => a.email.localeCompare(b.email),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.email}>
            {item.email}
          </TableCellLayout>
        ),
      },
      phone: {
        label: "Phone",
        compare: (a, b) => a.phone.localeCompare(b.phone),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.phone}>
            {item.phone}
          </TableCellLayout>
        ),
      },
      interestedDevelopmentName: {
        label: "Interested Development",
        compare: (a, b) => a.interestedDevelopmentName.localeCompare(b.interestedDevelopmentName),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.interestedDevelopmentName}>
            {item.interestedDevelopmentName}
          </TableCellLayout>
        ),
      },
    }),
    [onOpenBuyer],
  );

  const {
    columns,
    visibleColumnIds,
    addableColumns,
    handleColumnDragEnd,
    handleAddColumn,
    handleResetGridLayout,
  } = useCustomizableGridColumns({
    entityKey: "buyer",
    defaultColumnIds: BUYER_COLUMN_IDS,
    detailFieldIds: BUYER_DETAIL_FIELD_IDS,
    columnDefs,
    sortState,
    onSort: handleColumnSort,
    onMockCommand,
  });

  const { scrollRef, columnSizingOptions, onColumnResize, resizableColumnsOptions } =
    useFillResizableColumnSizing(visibleColumnIds);

  return (
    <DynamicsAppShell
      activeNav="buyers"
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
                    onClick={() => onOpenNewBuyer?.()}
                    title="Create a new buyer"
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
              <section className="dynamics-view" aria-label="Buyers view">
                <div className="dynamics-view-toolbar">
                  <div className="dynamics-view-toolbar__title-wrap">
                    <DynamicsViewTitlePicker
                      views={BUYER_VIEWS}
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
                        getRowId={(item) => item.buyerId}
                        focusMode="composite"
                        aria-label="Buyers — sortable, resizable columns"
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
                                onOpenBuyer?.(item.buyerId);
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
