import { useCallback, useMemo, useState } from "react";
import {
  Avatar,
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
  BuildingRegular,
  ChevronDownRegular,
  ClockRegular,
  ColumnTripleEditRegular,
  DataBarVerticalRegular,
  DataPieRegular,
  DeleteRegular,
  DocumentBulletListRegular,
  DocumentTextRegular,
  FilterRegular,
  FlowRegular,
  HomeRegular,
  LineHorizontal3Regular,
  LinkRegular,
  PeopleRegular,
  PersonAccountsRegular,
  PersonCircleRegular,
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
import useCustomizableGridColumns from "./layoutCustomization/useCustomizableGridColumns.jsx";

const DEVELOPMENT_COLUMN_IDS = [
  "developmentId",
  "name",
  "location",
  "status",
  "totalUnits",
  "ownerName",
  "createdOn",
];
import PowerAppsAppLauncherIcon from "./PowerAppsAppLauncherIcon.jsx";
import "./StudentsGrid.css";

/** Saved-view options for the Dynamics-style view title picker (UI prototype). */
const DEVELOPMENT_VIEWS = [
  { id: "active", label: "Active Developments", isDefault: true },
  { id: "planning", label: "Developments — Planning", isDefault: false },
  { id: "lastMonth", label: "Developments created last month", isDefault: false },
  { id: "completed", label: "Completed developments", isDefault: false },
  { id: "mine", label: "My developments", isDefault: false },
];

function OwnerCell({ name }) {
  return (
    <span className="dynamics-owner-cell">
      <Avatar name={name} size={24} color="colorful" />
      <span className="dynamics-owner-cell__name">{name}</span>
    </span>
  );
}

export default function DevelopmentsGrid({
  developments,
  onOpenDevelopment,
  onOpenNewDevelopment,
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
    sortColumn: "createdOn",
    sortDirection: "descending",
  });
  /** Controlled selection so the footer can show "N selected" */
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [selectedViewId, setSelectedViewId] = useState(DEVELOPMENT_VIEWS[0].id);

  /** Mock command bar — delete / refresh stay inert for the prototype */
  const onMockCommand = useCallback(() => {
    /* No-op until wired to create/delete/refresh APIs */
  }, []);

  const handleColumnSort = useCallback((columnId, direction) => {
    setSortState({ sortColumn: columnId, sortDirection: direction });
  }, []);

  const filteredItems = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return developments;
    return developments.filter((row) =>
      [row.developmentId, row.name, row.location, row.status, row.ownerName, String(row.totalUnits)].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [filter, developments]);

  const { toggleEditMode, gridEditMode } = useLayoutCustomization();

  const columnDefs = useMemo(
    () => ({
      developmentId: {
        label: "Development ID",
        compare: (a, b) => a.developmentId.localeCompare(b.developmentId),
        renderCell: (item) => (
          <button
            type="button"
            className="dynamics-grid-link"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDevelopment?.(item.developmentId);
            }}
            aria-label={`Open development ${item.developmentId}`}
          >
            {item.developmentId}
          </button>
        ),
      },
      name: {
        label: "Name",
        compare: (a, b) => a.name.localeCompare(b.name),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.name}>
            {item.name}
          </TableCellLayout>
        ),
      },
      location: {
        label: "Location",
        compare: (a, b) => a.location.localeCompare(b.location),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.location}>
            {item.location}
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
      totalUnits: {
        label: "Total Units",
        compare: (a, b) => a.totalUnits - b.totalUnits,
        renderCell: (item) => item.totalUnits,
      },
      ownerName: {
        label: "Owner",
        compare: (a, b) => a.ownerName.localeCompare(b.ownerName),
        renderCell: (item) => <OwnerCell name={item.ownerName} />,
      },
      createdOn: {
        label: "Created On",
        compare: (a, b) => a.createdOn.getTime() - b.createdOn.getTime(),
        renderCell: (item) => dateFmt.format(item.createdOn),
      },
    }),
    [onOpenDevelopment],
  );

  const {
    columns,
    visibleColumnIds,
    addableColumns,
    handleColumnDragEnd,
    handleAddColumn,
    handleResetGridLayout,
  } = useCustomizableGridColumns({
    entityKey: "development",
    defaultColumnIds: DEVELOPMENT_COLUMN_IDS,
    columnDefs,
    sortState,
    onSort: handleColumnSort,
    onMockCommand,
  });

  const { scrollRef, columnSizingOptions, onColumnResize, resizableColumnsOptions } =
    useFillResizableColumnSizing(visibleColumnIds);

  return (
    <div className={`dynamics-app ${sitemapCollapsed ? "dynamics-app--sitemap-collapsed" : ""}`}>
      <header className="dynamics-app-header" role="banner">
        <div className="dynamics-app-header__brand">
          <button type="button" className="dynamics-app-header__logo" aria-label="App launcher">
            <PowerAppsAppLauncherIcon />
          </button>
          <span className="dynamics-app-header__product">Power Apps</span>
          <span className="dynamics-app-header__pipe" aria-hidden="true">
            |
          </span>
          <span className="dynamics-app-header__app">Property Management</span>
          <span className="dynamics-app-header__divider" aria-hidden="true" />
          <span className="dynamics-app-header__env">SANDBOX</span>
        </div>
        <div className="dynamics-app-header__actions">
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Search">
            <SearchRegular />
          </button>
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Refresh">
            <ArrowClockwiseRegular />
          </button>
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Settings">
            <SettingsRegular />
          </button>
          <button type="button" className="dynamics-app-header__user" aria-label="Account">
            AD
          </button>
        </div>
      </header>

      <div className="dynamics-app-body">
        <nav
          className={`dynamics-sitemap mda-sitemap ${sitemapCollapsed ? "dynamics-sitemap--collapsed" : ""}`}
          aria-label="Site map"
        >
          <button
            type="button"
            className="dynamics-sitemap__toggle"
            onClick={onToggleSitemap}
            aria-label={sitemapCollapsed ? "Expand site map" : "Collapse site map"}
            aria-expanded={!sitemapCollapsed}
          >
            <LineHorizontal3Regular className="dynamics-sitemap__toggle-icon" />
          </button>
          <ul className="dynamics-sitemap__list dynamics-sitemap__list--pinned">
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <HomeRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Home</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <ClockRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Recent</span>
                <ChevronDownRegular className="dynamics-sitemap__chevron" />
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <PinRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Pinned</span>
                <ChevronDownRegular className="dynamics-sitemap__chevron" />
              </button>
            </li>
          </ul>
          <p className="mda-sitemap__group-label">Administration</p>
          <ul className="dynamics-sitemap__list dynamics-sitemap__list--section">
            <li>
              <button type="button" className="dynamics-sitemap__item dynamics-sitemap__item--active">
                <PeopleRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Developments</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateProperties?.()}>
                <BuildingRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Properties</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateBuyers?.()}>
                <PersonCircleRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Buyers</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateContracts?.()}>
                <DocumentTextRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Contracts</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateSalesStaff?.()}>
                <PersonAccountsRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Sales Staff</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <SettingsRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        <main className="dynamics-main">
          <div className="dynamics-main-surface">
            <div className="dynamics-surface-card dynamics-surface-card--command">
              <div className="dynamics-commandbar" role="toolbar" aria-label="Commands">
                <div className="dynamics-commandbar__scroll">
              <Button
                appearance="subtle"
                type="button"
                onClick={onMockCommand}
                title="Preview only — chart view"
              >
                <span className="dynamics-cmd-btn__inner">
                  <DataBarVerticalRegular className="dynamics-cmd-btn__icon" />
                  <span>Show Chart</span>
                </span>
              </Button>
              <Button
                appearance="subtle"
                type="button"
                onClick={() => onOpenNewDevelopment?.()}
                title="Create a new development"
              >
                <span className="dynamics-cmd-btn__inner">
                  <AddRegular className="dynamics-cmd-btn__icon" />
                  <span>New</span>
                </span>
              </Button>
              <Button
                appearance="subtle"
                type="button"
                onClick={onMockCommand}
                title="Preview only — delete options"
              >
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
              <section className="dynamics-view" aria-label="Developments view">
                <div className="dynamics-view-toolbar">
                  <div className="dynamics-view-toolbar__title-wrap">
                    <DynamicsViewTitlePicker
                      views={DEVELOPMENT_VIEWS}
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
                        getRowId={(item) => item.developmentId}
                        focusMode="composite"
                        aria-label="Developments — sortable, resizable columns"
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
                              onClick={(e) => {
                                if (e.target.closest("button, input, [role='checkbox']")) return;
                                onOpenDevelopment?.(item.developmentId);
                              }}
                              onDoubleClick={(e) => {
                                e.preventDefault();
                                onOpenDevelopment?.(item.developmentId);
                              }}
                            >
                              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                            </DataGridRow>
                          )}
                        </DataGridBody>
                      </DataGrid>
                      <footer className="dynamics-grid-footer">
                        <span className="dynamics-grid-footer__count">
                          Rows: {filteredItems.length}
                        </span>
                        {selectedRows.size > 0 ? (
                          <>
                            <span className="dynamics-grid-footer__divider" aria-hidden="true">
                              |
                            </span>
                            <span className="dynamics-grid-footer__count">
                              {selectedRows.size} selected
                            </span>
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
      </div>
    </div>
  );
}
