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
  createTableColumn,
} from "@fluentui/react-components";
import {
  AddRegular,
  ArrowAutofitWidthRegular,
  ArrowClockwiseRegular,
  ArrowDownRegular,
  ArrowExportRegular,
  ArrowImportRegular,
  ArrowLeftRegular,
  ArrowRightRegular,
  ArrowUpRegular,
  BookContactsRegular,
  ChevronDownRegular,
  ColumnTripleEditRegular,
  DataBarVerticalRegular,
  DataPieRegular,
  DeleteRegular,
  DocumentBulletListRegular,
  DocumentRegular,
  FilterRegular,
  FlowRegular,
  GridRegular,
  GroupListRegular,
  LinkRegular,
  PeopleRegular,
  SearchRegular,
  SettingsRegular,
  ShareRegular,
  TableRegular,
} from "@fluentui/react-icons";
import {
  getAssignedLecturer,
  getCoursesForStudent,
  studentCourseLinks,
  studentLecturerLink,
} from "./mockRelated.js";
import "./StudentsGrid.css";

const dateFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function statusClass(status) {
  const key = String(status).toLowerCase();
  return `dynamics-status dynamics-status--${key}`;
}

function StatusCell({ status }) {
  return <span className={statusClass(status)}>{status}</span>;
}

function OwnerCell({ name }) {
  return (
    <span className="dynamics-owner-cell">
      <Avatar name={name} size={24} color="colorful" />
      <span className="dynamics-owner-cell__name">{name}</span>
    </span>
  );
}

function LecturerCell({ name }) {
  if (!name) {
    return <span className="dynamics-grid-empty">—</span>;
  }
  return (
    <span className="dynamics-owner-cell">
      <Avatar name={name} size={24} color="colorful" />
      <span className="dynamics-owner-cell__name">{name}</span>
    </span>
  );
}

function CoursesCell({ courses }) {
  if (!courses || courses.length === 0) {
    return <span className="dynamics-grid-empty">No courses</span>;
  }
  const label = courses.map((c) => c.courseId).join(", ");
  const tooltip = courses.map((c) => `${c.courseId} — ${c.courseName}`).join("\n");
  return (
    <span className="dynamics-courses-cell" title={tooltip}>
      <span className="dynamics-courses-cell__count">{courses.length}</span>
      <span className="dynamics-courses-cell__list">{label}</span>
    </span>
  );
}

/** Dynamics-style column header — label + sort indicator + ⌄ menu (Sort / Group / Filter / Move) */
function HeaderMenu({ columnId, label, sortState, onSort, onMockCommand }) {
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

export default function StudentsGrid({
  students,
  courseLinks = studentCourseLinks,
  lecturerLinks = studentLecturerLink,
  onOpenStudent,
  onOpenApplication,
}) {
  const [filter, setFilter] = useState("");
  const [sortState, setSortState] = useState({
    sortColumn: "createdOn",
    sortDirection: "descending",
  });
  /** Controlled selection so the footer can show "N selected" */
  const [selectedRows, setSelectedRows] = useState(() => new Set());

  /** Mock command bar — delete / refresh stay inert for the prototype */
  const onMockCommand = useCallback(() => {
    /* No-op until wired to create/delete/refresh APIs */
  }, []);

  const handleColumnSort = useCallback((columnId, direction) => {
    setSortState({ sortColumn: columnId, sortDirection: direction });
  }, []);

  /** Pre-compute lecturer + courses per row so sorting/filtering can use string values directly */
  const enrichedStudents = useMemo(() => {
    return students.map((s) => {
      const lecturer = getAssignedLecturer(s.studentId, lecturerLinks);
      const courses = getCoursesForStudent(s.studentId, courseLinks);
      return {
        ...s,
        lecturerName: lecturer?.name ?? "",
        courses,
        coursesLabel: courses.map((c) => c.courseId).join(", "),
      };
    });
  }, [students, courseLinks, lecturerLinks]);

  const filteredItems = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return enrichedStudents;
    return enrichedStudents.filter((row) =>
      [row.studentId, row.fullName, row.email, row.status, row.ownerName, row.lecturerName, row.coursesLabel].some(
        (v) => String(v).toLowerCase().includes(q)
      )
    );
  }, [filter, enrichedStudents]);

  const columns = useMemo(() => {
    const headerOf = (columnId, label) => (
      <HeaderMenu
        columnId={columnId}
        label={label}
        sortState={sortState}
        onSort={handleColumnSort}
        onMockCommand={onMockCommand}
      />
    );
    return [
      createTableColumn({
        columnId: "studentId",
        compare: (a, b) => a.studentId.localeCompare(b.studentId),
        renderHeaderCell: () => headerOf("studentId", "Student ID"),
        renderCell: (item) => (
          <button
            type="button"
            className="dynamics-grid-link"
            onClick={(e) => {
              e.stopPropagation();
              onOpenStudent?.(item.studentId);
            }}
            aria-label={`Open student ${item.studentId}`}
          >
            {item.studentId}
          </button>
        ),
      }),
      createTableColumn({
        columnId: "fullName",
        compare: (a, b) => a.fullName.localeCompare(b.fullName),
        renderHeaderCell: () => headerOf("fullName", "Name"),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.fullName}>
            {item.fullName}
          </TableCellLayout>
        ),
      }),
      createTableColumn({
        columnId: "email",
        compare: (a, b) => a.email.localeCompare(b.email),
        renderHeaderCell: () => headerOf("email", "Email"),
        renderCell: (item) => (
          <TableCellLayout truncate title={item.email}>
            {item.email}
          </TableCellLayout>
        ),
      }),
      createTableColumn({
        columnId: "status",
        compare: (a, b) => a.status.localeCompare(b.status),
        renderHeaderCell: () => headerOf("status", "Status"),
        renderCell: (item) => <StatusCell status={item.status} />,
      }),
      createTableColumn({
        columnId: "lecturerName",
        compare: (a, b) => a.lecturerName.localeCompare(b.lecturerName),
        renderHeaderCell: () => headerOf("lecturerName", "Lecturer"),
        renderCell: (item) => <LecturerCell name={item.lecturerName} />,
      }),
      createTableColumn({
        columnId: "courses",
        compare: (a, b) => a.courses.length - b.courses.length,
        renderHeaderCell: () => headerOf("courses", "Courses"),
        renderCell: (item) => <CoursesCell courses={item.courses} />,
      }),
      createTableColumn({
        columnId: "ownerName",
        compare: (a, b) => a.ownerName.localeCompare(b.ownerName),
        renderHeaderCell: () => headerOf("ownerName", "Owner"),
        renderCell: (item) => <OwnerCell name={item.ownerName} />,
      }),
      createTableColumn({
        columnId: "createdOn",
        compare: (a, b) => a.createdOn.getTime() - b.createdOn.getTime(),
        renderHeaderCell: () => headerOf("createdOn", "Created On"),
        renderCell: (item) => dateFmt.format(item.createdOn),
      }),
    ];
  }, [sortState, handleColumnSort, onMockCommand, onOpenStudent]);

  /** Equal default widths — real equal distribution is enforced by CSS flex on the row */
  const columnSizingOptions = useMemo(
    () => ({
      studentId: { defaultWidth: 160, minWidth: 80 },
      fullName: { defaultWidth: 160, minWidth: 80 },
      email: { defaultWidth: 160, minWidth: 80 },
      status: { defaultWidth: 160, minWidth: 80 },
      lecturerName: { defaultWidth: 160, minWidth: 80 },
      courses: { defaultWidth: 160, minWidth: 80 },
      ownerName: { defaultWidth: 160, minWidth: 80 },
      createdOn: { defaultWidth: 160, minWidth: 80 },
    }),
    []
  );

  return (
    <div className="dynamics-app">
      <header className="dynamics-app-header" role="banner">
        <div className="dynamics-app-header__brand">
          <span className="dynamics-app-header__logo" aria-hidden="true">
            <GridRegular />
          </span>
          <span className="dynamics-app-header__product">Power Apps</span>
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
        <nav className="dynamics-sitemap" aria-label="Site map">
          <ul className="dynamics-sitemap__list">
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <DocumentRegular className="dynamics-sitemap__icon" />
                <span>Applications</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item dynamics-sitemap__item--active">
                <PeopleRegular className="dynamics-sitemap__icon" />
                <span>Students</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <BookContactsRegular className="dynamics-sitemap__icon" />
                <span>Courses</span>
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
                onClick={() => onOpenApplication?.()}
                title="Create a new student via university application"
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
              <section className="dynamics-view" aria-label="Students view">
                <div className="dynamics-view-toolbar">
                  <div className="dynamics-view-toolbar__title-wrap">
                    <h1 className="dynamics-view-title">Active Students</h1>
                  </div>
                  <div className="dynamics-view-toolbar__controls">
                    <button type="button" className="dynamics-view-toolbar__link dynamics-view-toolbar__link--icon">
                      <ColumnTripleEditRegular className="dynamics-view-toolbar__link-icon" aria-hidden="true" />
                      Edit columns
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
                      contentBefore={<SearchRegular className="dynamics-keyword-search__icon" />}
                      aria-label="Filter by keyword"
                    />
                  </div>
                </div>

                <div className="dynamics-grid-card">
                  <div className="dynamics-grid-scroll dynamics-grid-scroll--list">
                    <div className="dynamics-grid-scroll__inner">
                      <DataGrid
                        items={filteredItems}
                        columns={columns}
                        sortable
                        sortState={sortState}
                        onSortChange={(_, next) => setSortState(next)}
                        resizableColumns
                        columnSizingOptions={columnSizingOptions}
                        resizableColumnsOptions={{ autoFitColumns: true }}
                        selectionMode="multiselect"
                        selectionAppearance="neutral"
                        subtleSelection
                        selectedItems={selectedRows}
                        onSelectionChange={(_, data) => setSelectedRows(data.selectedItems)}
                        size="small"
                        getRowId={(item) => item.studentId}
                        focusMode="composite"
                        aria-label="Students — sortable, resizable columns"
                      >
                        <DataGridHeader>
                          <DataGridRow selectionCell={{ "aria-label": "Select all rows" }}>
                            {({ renderHeaderCell }) => (
                              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                            )}
                          </DataGridRow>
                        </DataGridHeader>
                        <DataGridBody>
                          {({ item, rowId }) => (
                            <DataGridRow
                              key={rowId}
                              selectionCell={{ "aria-label": "Select row" }}
                              onDoubleClick={(e) => {
                                e.preventDefault();
                                onOpenStudent?.(item.studentId);
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
