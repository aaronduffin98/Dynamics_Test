import { useCallback, useMemo, useState } from "react";
import {
  AddRegular,
  AddSquareRegular,
  ArrowSortRegular,
  ArrowLeftRegular,
  BookContactsRegular,
  BuildingRegular,
  ChevronDownRegular,
  ClockRegular,
  DocumentRegular,
  DocumentTextRegular,
  FilterRegular,
  HomeRegular,
  LineHorizontal3Regular,
  MoreHorizontalRegular,
  PenRegular,
  PeopleRegular,
  PeopleTeamRegular,
  PersonAccountsRegular,
  PersonCircleRegular,
  PersonRegular,
  PinRegular,
  QuestionCircleRegular,
  SaveRegular,
  SearchRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import { Avatar, Button as FluentButton, Checkbox as FluentCheckbox, Input as FluentInput } from "@fluentui/react-components";
import { mockCourses, mockLecturers } from "./mockRelated.js";
import { PROGRAM_COORDINATOR_NAME } from "./programCoordinator.js";
import PowerAppsAppLauncherIcon from "./PowerAppsAppLauncherIcon.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";
import "./UniversityApplicationForm.css";

const dateLong = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeStyle: "short",
});

const dateShort = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const SCHOOL_DIVISIONS = [
  "College of Arts & Humanities",
  "School of Science & Engineering",
  "School of Business & Economics",
  "College of Social Sciences & Education",
];

function schoolDivisionForRecordId(recordId) {
  const key = String(recordId).replace(/\D/g, "") || "0";
  const n = key.split("").reduce((acc, d) => acc + Number(d), 0);
  return SCHOOL_DIVISIONS[n % SCHOOL_DIVISIONS.length];
}

function allocateStudentId(existingStudents) {
  let max = 10000;
  for (const s of existingStudents) {
    const m = /^DEV-(\d+)$/.exec(s.studentId);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `DEV-${String(max + 1).padStart(5, "0")}`;
}

function DetailRow({ label, required, alignTop, error, children }) {
  return (
    <div className={`mda-detail-row ${alignTop ? "mda-detail-row--top" : ""}`}>
      <label className="mda-detail-row__label">
        {label}
        {required ? (
          <span className="mda-detail-row__req" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <div className="mda-detail-row__control">
        {children}
        {error ? (
          <span className="mda-field__error" role="alert">
            {error}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function HeaderSummaryField({ primary, secondary, variant = "default", showAvatar, avatarName }) {
  const text = primary ?? "—";
  const primaryEl =
    variant === "link" ? (
      <button type="button" className="mda-record-header__summary-link">
        {text}
      </button>
    ) : (
      <span className="mda-record-header__summary-strong">{text}</span>
    );

  return (
    <div className="mda-record-header__summary-field">
      <div className="mda-record-header__summary-top">
        {showAvatar && avatarName ? (
          <Avatar name={avatarName} size={24} color="colorful" />
        ) : null}
        {primaryEl}
      </div>
      <span className="mda-record-header__summary-caption">{secondary}</span>
    </div>
  );
}

export default function UniversityApplicationForm({
  existingStudents,
  onSubmit,
  onCancel,
  onNavigateStudents,
  onNavigateProperties,
  onNavigateBuyers,
  onNavigateContracts,
  onNavigateStaff,
  onNavigateSalesStaff,
  onNavigateDepartments,
  onNavigateCourses,
  onNavigateLecturers,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const [activeTab, setActiveTab] = useState("general");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCourses, setSelectedCourses] = useState(() => new Set());
  const [lecturerId, setLecturerId] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const draftStartedOn = useMemo(() => new Date(), []);
  const previewId = useMemo(() => allocateStudentId(existingStudents), [existingStudents]);
  const schoolDivision = useMemo(() => schoolDivisionForRecordId(previewId), [previewId]);
  const createdLabel = useMemo(() => dateLong.format(draftStartedOn), [draftStartedOn]);
  const createdShort = useMemo(() => dateShort.format(draftStartedOn), [draftStartedOn]);

  const selectedLecturer = useMemo(
    () => mockLecturers.find((l) => l.lecturerId === lecturerId) ?? null,
    [lecturerId]
  );

  const toggleCourse = useCallback((courseId, checked) => {
    setSelectedCourses((prev) => {
      const next = new Set(prev);
      if (checked) next.add(courseId);
      else next.delete(courseId);
      return next;
    });
  }, []);

  const validationMessage = useMemo(() => {
    if (!attemptedSubmit) return {};
    const msg = {};
    if (!firstName.trim()) msg.firstName = "Enter a first name.";
    if (!lastName.trim()) msg.lastName = "Enter a last name.";
    if (!location.trim()) msg.location = "Enter a location.";
    return msg;
  }, [attemptedSubmit, firstName, lastName, location]);

  const runSubmit = useCallback(() => {
    setAttemptedSubmit(true);
    if (!firstName.trim()) return;
    if (!lastName.trim()) return;
    if (!location.trim()) return;

    const studentId = allocateStudentId(existingStudents);
    const lecturer = lecturerId ? mockLecturers.find((l) => l.lecturerId === lecturerId) : null;
    const student = {
      studentId,
      fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
      location: location.trim(),
      region: location.trim().split(",")[0]?.trim() || location.trim(),
      status: "Planning",
      totalUnits: 0,
      ownerName: lecturer?.name ?? PROGRAM_COORDINATOR_NAME,
      createdOn: new Date(),
    };

    onSubmit({
      student,
      courseIds: [...selectedCourses],
      lecturerId: lecturerId || "",
    });
  }, [
    existingStudents,
    firstName,
    lastName,
    location,
    selectedCourses,
    lecturerId,
    onSubmit,
  ]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      runSubmit();
    },
    [runSubmit]
  );

  return (
    <div
      className={`dynamics-app mda-new-record mda-detail-record mda-application-form ${sitemapCollapsed ? "dynamics-app--sitemap-collapsed" : ""}`}
    >
      <header className="dynamics-app-header" role="banner">
        <div className="dynamics-app-header__brand">
          <button type="button" className="dynamics-app-header__logo" aria-label="App launcher">
            <PowerAppsAppLauncherIcon />
          </button>
          <span className="dynamics-app-header__product">Power Apps</span>
          <span className="dynamics-app-header__pipe" aria-hidden="true">
            |
          </span>
          <span className="dynamics-app-header__app">College Portal</span>
          <span className="dynamics-app-header__divider" aria-hidden="true" />
          <span className="dynamics-app-header__env">SANDBOX</span>
        </div>
        <div className="dynamics-app-header__actions">
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Search">
            <SearchRegular />
          </button>
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Quick create">
            <AddSquareRegular />
          </button>
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Filter">
            <FilterRegular />
          </button>
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Settings">
            <SettingsRegular />
          </button>
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Help">
            <QuestionCircleRegular />
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
          <p className="mda-sitemap__group-label">Dashboards</p>
          <ul className="dynamics-sitemap__list dynamics-sitemap__list--section">
            <li>
              <button type="button" className="dynamics-sitemap__item dynamics-sitemap__item--active">
                <DocumentRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Applications</span>
              </button>
            </li>
          </ul>
          <p className="mda-sitemap__group-label">Administration</p>
          <ul className="dynamics-sitemap__list dynamics-sitemap__list--section">
            <li>
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateStudents?.()}>
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
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateStaff?.()}>
                <PeopleTeamRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Staff</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateSalesStaff?.()}>
                <PersonAccountsRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Sales Staff</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateLecturers?.()}>
                <PersonRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Lecturers</span>
              </button>
            </li>
          </ul>
          <p className="mda-sitemap__group-label">Configuration</p>
          <ul className="dynamics-sitemap__list dynamics-sitemap__list--section">
            <li>
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateCourses?.()}>
                <BookContactsRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Courses</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateDepartments?.()}>
                <BuildingRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Departments</span>
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

        <main className="dynamics-main mda-record-main">
          <div className="mda-record-commandbar" role="toolbar" aria-label="Record commands">
            <FluentButton
              appearance="subtle"
              icon={<ArrowLeftRegular fontSize={16} />}
              onClick={onCancel}
              type="button"
              aria-label="Back"
            >
              Back
            </FluentButton>
            <FluentButton appearance="subtle" icon={<SaveRegular fontSize={16} />} type="submit" form="uni-app-record-form">
              Save
            </FluentButton>
            <FluentButton appearance="subtle" icon={<SaveRegular fontSize={16} />} type="button" onClick={runSubmit}>
              Save &amp; Close
            </FluentButton>
          </div>

          <div className="mda-record-workspace">
            <form id="uni-app-record-form" className="mda-record-form mda-detail-page-layout" onSubmit={handleSubmit} noValidate>
              <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="mda-app-form-title">
                <header className="mda-record-header mda-record-header--detail">
                  <div className="mda-record-header__main">
                    <h2 id="mda-app-form-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{previewId}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-unsaved">Not saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Development</p>
                  </div>
                  <div className="mda-record-header__summary">
                    <div className="mda-record-header__context">
                      <HeaderSummaryField primary={schoolDivision} secondary="Base" />
                      <HeaderSummaryField
                        primary={PROGRAM_COORDINATOR_NAME}
                        secondary="Program coordinator"
                        variant="link"
                        showAvatar
                        avatarName={PROGRAM_COORDINATOR_NAME}
                      />
                      <HeaderSummaryField
                        primary={selectedLecturer?.name ?? "—"}
                        secondary="Faculty advisor"
                        variant={selectedLecturer ? "link" : "default"}
                        showAvatar={Boolean(selectedLecturer)}
                        avatarName={selectedLecturer?.name}
                      />
                    </div>
                    <button
                      type="button"
                      className="mda-record-header__summary-expand"
                      aria-label="Show more header fields"
                      title="Preview only"
                    >
                      <ChevronDownRegular className="mda-record-header__summary-expand-icon" aria-hidden />
                    </button>
                  </div>
                </header>

                <div className="mda-tabs mda-tabs--in-summary" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "general"}
                    className={`mda-tab ${activeTab === "general" ? "mda-tab--active" : ""}`}
                    onClick={() => setActiveTab("general")}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "related"}
                    className={`mda-tab ${activeTab === "related" ? "mda-tab--active" : ""}`}
                    onClick={() => setActiveTab("related")}
                  >
                    <span className="mda-tab__inner">
                      Related <ChevronDownRegular fontSize={12} />
                    </span>
                  </button>
                  <span className="mda-tabs__spacer" aria-hidden="true" />
                  <button type="button" className="mda-tabs__assist" disabled title="Preview only">
                    Form assist
                  </button>
                </div>
              </section>

              <div className="mda-detail-record-grid">
                <section className="mda-record-card mda-record-card--form" aria-label="Application details">
                  {activeTab === "general" ? (
                    <div className="mda-detail-columns">
                      <DetailRow label="First name" required error={validationMessage.firstName}>
                        <FluentInput
                          value={firstName}
                          onChange={(_, d) => setFirstName(d.value)}
                          placeholder="Type here"
                          className="mda-input"
                        />
                      </DetailRow>
                      <DetailRow label="Last name" required error={validationMessage.lastName}>
                        <FluentInput
                          value={lastName}
                          onChange={(_, d) => setLastName(d.value)}
                          placeholder="Type here"
                          className="mda-input"
                        />
                      </DetailRow>
                      <DetailRow label="Location" required error={validationMessage.location}>
                        <FluentInput
                          value={location}
                          onChange={(_, d) => setLocation(d.value)}
                          placeholder="City, region, country"
                          className="mda-input"
                        />
                      </DetailRow>
                      <DetailRow label="Development ID">
                        <FluentInput readOnly value={previewId} className="mda-input" />
                      </DetailRow>
                      <DetailRow label="Status">
                        <FluentInput readOnly value="Planning" className="mda-input" />
                      </DetailRow>
                      <DetailRow label="Record created">
                        <FluentInput readOnly value={createdLabel} className="mda-input" />
                      </DetailRow>
                      <DetailRow label="Faculty advisor" error={validationMessage.lecturer}>
                        <div className="mda-detail-row__owner">
                          {selectedLecturer ? (
                            <Avatar name={selectedLecturer.name} size={20} color="colorful" />
                          ) : null}
                          <select
                            className="mda-select mda-app-advisor-select"
                            value={lecturerId}
                            onChange={(e) => setLecturerId(e.target.value)}
                            aria-required="false"
                          >
                            <option value="">Select faculty advisor…</option>
                            {mockLecturers.map((l) => (
                              <option key={l.lecturerId} value={l.lecturerId}>
                                {l.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </DetailRow>
                      <DetailRow label="Records owner">
                        <div className="mda-detail-row__owner">
                          <Avatar name={PROGRAM_COORDINATOR_NAME} size={20} color="colorful" />
                          <FluentInput readOnly value={PROGRAM_COORDINATOR_NAME} className="mda-input mda-detail-row__owner-input" />
                        </div>
                      </DetailRow>
                      <DetailRow label="Enrolled courses" alignTop error={validationMessage.courses}>
                        <div className="mda-checkbox-stack" role="group" aria-label="Select courses">
                          {mockCourses.map((c) => (
                            <FluentCheckbox
                              key={c.courseId}
                              checked={selectedCourses.has(c.courseId)}
                              onChange={(_, data) => toggleCourse(c.courseId, Boolean(data.checked))}
                              label={`${c.courseId} — ${c.courseName}`}
                            />
                          ))}
                        </div>
                      </DetailRow>
                      <DetailRow label="Course load (count)">
                        <FluentInput readOnly value={String(selectedCourses.size)} className="mda-input" />
                      </DetailRow>
                    </div>
                  ) : (
                    <div className="mda-detail-related">
                      <p className="mda-app-related-hint">
                        Related records will be available after the application is saved.
                      </p>
                    </div>
                  )}
                </section>

                <aside className="mda-record-card mda-record-card--timeline" aria-label="Timeline">
                  <div className="mda-timeline-aside__bar">
                    <span className="mda-timeline-aside__title">Timeline</span>
                    <div className="mda-timeline-aside__actions">
                      <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Add to timeline">
                        <AddRegular />
                      </button>
                      <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Filter timeline">
                        <FilterRegular />
                      </button>
                      <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Sort">
                        <ArrowSortRegular />
                      </button>
                      <button type="button" className="mda-timeline-aside__icon-btn" aria-label="More">
                        <MoreHorizontalRegular />
                      </button>
                    </div>
                  </div>
                  <div className="mda-timeline-aside__body">
                    <FluentInput
                      placeholder="Search timeline"
                      contentBefore={<SearchRegular className="mda-timeline-aside__field-icon" aria-hidden />}
                      className="mda-timeline-aside__search"
                      disabled
                      appearance="outline"
                      aria-label="Search timeline"
                    />
                    <FluentInput
                      placeholder="Enter a note…"
                      contentAfter={<PenRegular className="mda-timeline-aside__field-icon" aria-hidden />}
                      className="mda-timeline-aside__note"
                      disabled
                      appearance="outline"
                      aria-label="Note"
                    />
                    <div className="mda-timeline-aside__empty">
                      <span className="mda-timeline-aside__empty-icon" aria-hidden="true">
                        <DocumentRegular fontSize={32} />
                      </span>
                      <h3 className="mda-timeline-aside__empty-title">Get started</h3>
                      <p className="mda-timeline-aside__empty-text">
                        Add notes, portal messages, and activities to build this applicant&apos;s timeline.
                      </p>
                      <p className="mda-timeline-aside__empty-meta">Record draft started on {createdShort}</p>
                    </div>
                  </div>
                </aside>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
