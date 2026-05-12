import { useMemo, useState } from "react";
import {
  Avatar,
  Button as FluentButton,
  Input as FluentInput,
} from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  AttachRegular,
  BookContactsRegular,
  ChevronDownRegular,
  DeleteRegular,
  DocumentRegular,
  FilterRegular,
  FlowRegular,
  GridRegular,
  HomeRegular,
  MoreHorizontalRegular,
  PeopleRegular,
  PersonAddRegular,
  PinRegular,
  SaveRegular,
  SearchRegular,
  SettingsRegular,
  ShareRegular,
  ShieldCheckmarkRegular,
} from "@fluentui/react-icons";
import StudentRelatedGrids from "./StudentRelatedGrids.jsx";
import { getAssignedLecturer, getCoursesForStudent } from "./mockRelated.js";
import "./UniversityApplicationForm.css";
import "./StudentDetailView.css";

const dateLong = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeStyle: "short",
});

const dateShort = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

function splitFullName(fullName) {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** Horizontal label-left field row used inside the Dynamics detail form */
function DetailRow({ label, required, alignTop, children }) {
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
      <div className="mda-detail-row__control">{children}</div>
    </div>
  );
}

function HeaderContextField({ label, value, avatarName }) {
  return (
    <div className="mda-record-header__context-field">
      <span className="mda-record-header__context-label">{label}</span>
      {avatarName ? (
        <span className="mda-record-header__context-value mda-record-header__context-value--avatar">
          <Avatar name={avatarName} size={28} color="colorful" />
          <span className="mda-record-header__context-text">{value || avatarName}</span>
        </span>
      ) : (
        <span className="mda-record-header__context-value">{value || "—"}</span>
      )}
    </div>
  );
}

export default function StudentDetailView({ student, onBack, courseLinks, lecturerLinks }) {
  const [activeTab, setActiveTab] = useState("general");
  const { firstName, lastName } = splitFullName(student.fullName);
  const createdLabel = useMemo(() => dateLong.format(student.createdOn), [student.createdOn]);
  const createdShort = useMemo(() => dateShort.format(student.createdOn), [student.createdOn]);

  const lecturer = useMemo(
    () => getAssignedLecturer(student.studentId, lecturerLinks),
    [student.studentId, lecturerLinks]
  );
  const courses = useMemo(
    () => getCoursesForStudent(student.studentId, courseLinks),
    [student.studentId, courseLinks]
  );

  const coursesLabel = courses.length === 0
    ? "—"
    : courses.map((c) => `${c.courseId} — ${c.courseName}`).join("; ");

  return (
    <div className="dynamics-app mda-new-record mda-detail-record">
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
        <nav className="dynamics-sitemap mda-sitemap" aria-label="Site map">
          <ul className="dynamics-sitemap__list">
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <HomeRegular className="dynamics-sitemap__icon" />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <ArrowClockwiseRegular className="dynamics-sitemap__icon" />
                <span>Recent</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <PinRegular className="dynamics-sitemap__icon" />
                <span>Pinned</span>
              </button>
            </li>
          </ul>
          <p className="mda-sitemap__group-label">Apps</p>
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
          <p className="mda-sitemap__group-label">Administration</p>
          <ul className="dynamics-sitemap__list">
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <SettingsRegular className="dynamics-sitemap__icon" />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        <main className="dynamics-main mda-record-main">
          <div className="mda-record-commandbar" role="toolbar" aria-label="Record commands">
            <FluentButton
              appearance="subtle"
              icon={<ArrowLeftRegular fontSize={16} />}
              onClick={onBack}
              type="button"
            >
              Back
            </FluentButton>
            <FluentButton appearance="subtle" icon={<SaveRegular fontSize={16} />} type="button" disabled title="Preview only">
              Save
            </FluentButton>
            <FluentButton appearance="subtle" icon={<SaveRegular fontSize={16} />} type="button" disabled title="Preview only">
              Save &amp; Close
            </FluentButton>
            <FluentButton appearance="subtle" icon={<AddRegular fontSize={16} />} type="button" disabled title="Preview only">
              New
            </FluentButton>
            <FluentButton appearance="subtle" icon={<DeleteRegular fontSize={16} />} type="button" disabled title="Preview only">
              Delete
            </FluentButton>
            <FluentButton appearance="subtle" icon={<ArrowClockwiseRegular fontSize={16} />} type="button" disabled title="Preview only">
              Refresh
            </FluentButton>
            <FluentButton appearance="subtle" icon={<ShieldCheckmarkRegular fontSize={16} />} type="button" disabled title="Preview only">
              Check Access
            </FluentButton>
            <FluentButton appearance="subtle" icon={<PersonAddRegular fontSize={16} />} type="button" disabled title="Preview only">
              Assign
            </FluentButton>
            <FluentButton
              appearance="subtle"
              icon={<FlowRegular fontSize={16} />}
              iconPosition="before"
              type="button"
              disabled
              title="Preview only"
            >
              <span className="mda-commandbar__flow-label">
                Flow <ChevronDownRegular fontSize={12} />
              </span>
            </FluentButton>
            <span className="mda-record-commandbar__spacer" aria-hidden="true" />
            <FluentButton appearance="subtle" icon={<ShareRegular fontSize={16} />} type="button" disabled title="Preview only">
              Share
            </FluentButton>
          </div>

          <div className="mda-record-workspace">
            <div className="mda-record-form mda-detail-record-grid">
              <section className="mda-record-card mda-record-card--form" aria-labelledby="mda-detail-card-title">
                <header className="mda-record-header mda-record-header--detail">
                  <div className="mda-record-header__main">
                    <div className="mda-record-header__title-row">
                      <h2 id="mda-detail-card-title" className="mda-record-header__title">
                        {student.fullName}
                      </h2>
                      <span className="mda-record-header__saved">Saved</span>
                    </div>
                    <div className="mda-record-header__row">
                      <span className="mda-record-header__id">{student.studentId}</span>
                      <span className="mda-record-header__divider-dot" aria-hidden="true">
                        ·
                      </span>
                      <span className="mda-record-header__entity">Student</span>
                    </div>
                  </div>
                  <div className="mda-record-header__context">
                    <HeaderContextField label="Status" value={student.status} />
                    <HeaderContextField label="Owner" value={student.ownerName} avatarName={student.ownerName} />
                    <HeaderContextField
                      label="Lecturer"
                      value={lecturer?.name ?? "Unassigned"}
                      avatarName={lecturer?.name}
                    />
                  </div>
                </header>

                <div className="mda-tabs" role="tablist">
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

                {activeTab === "general" ? (
                  <div className="mda-detail-columns">
                    <DetailRow label="First name" required>
                      <FluentInput readOnly value={firstName} className="mda-input" />
                    </DetailRow>
                    <DetailRow label="Last name" required>
                      <FluentInput readOnly value={lastName} className="mda-input" />
                    </DetailRow>
                    <DetailRow label="Email" required>
                      <FluentInput readOnly value={student.email} className="mda-input" />
                    </DetailRow>
                    <DetailRow label="Student ID">
                      <FluentInput readOnly value={student.studentId} className="mda-input" />
                    </DetailRow>
                    <DetailRow label="Application status">
                      <FluentInput readOnly value={student.status} className="mda-input" />
                    </DetailRow>
                    <DetailRow label="Created on">
                      <FluentInput readOnly value={createdLabel} className="mda-input" />
                    </DetailRow>
                    <DetailRow label="Assigned lecturer">
                      {lecturer ? (
                        <div className="mda-detail-row__owner">
                          <Avatar name={lecturer.name} size={20} color="colorful" />
                          <FluentInput readOnly value={lecturer.name} className="mda-input mda-detail-row__owner-input" />
                        </div>
                      ) : (
                        <FluentInput readOnly value="Unassigned" className="mda-input" />
                      )}
                    </DetailRow>
                    <DetailRow label="Owner">
                      <div className="mda-detail-row__owner">
                        <Avatar name={student.ownerName} size={20} color="colorful" />
                        <FluentInput readOnly value={student.ownerName} className="mda-input mda-detail-row__owner-input" />
                      </div>
                    </DetailRow>
                    <DetailRow label="Courses" alignTop>
                      <FluentInput
                        readOnly
                        value={coursesLabel}
                        className="mda-input"
                        title={coursesLabel}
                      />
                    </DetailRow>
                    <DetailRow label="Course count">
                      <FluentInput readOnly value={String(courses.length)} className="mda-input" />
                    </DetailRow>
                  </div>
                ) : (
                  <div className="mda-detail-related">
                    <StudentRelatedGrids
                      studentId={student.studentId}
                      courseLinks={courseLinks}
                      lecturerLinks={lecturerLinks}
                    />
                  </div>
                )}
              </section>

              <aside className="mda-record-card mda-record-card--timeline" aria-label="Timeline">
                <div className="mda-timeline-aside__bar">
                  <span className="mda-timeline-aside__title">Timeline</span>
                  <div className="mda-timeline-aside__actions">
                    <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Search timeline">
                      <SearchRegular />
                    </button>
                    <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Add note">
                      <AddRegular />
                    </button>
                    <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Filter">
                      <FilterRegular />
                    </button>
                    <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Refresh">
                      <ArrowClockwiseRegular />
                    </button>
                    <button type="button" className="mda-timeline-aside__icon-btn" aria-label="More">
                      <MoreHorizontalRegular />
                    </button>
                  </div>
                </div>
                <div className="mda-timeline-aside__body">
                  <FluentInput
                    placeholder="Enter a note…"
                    contentAfter={<AttachRegular />}
                    className="mda-timeline-aside__note"
                    disabled
                    appearance="outline"
                  />
                  <div className="mda-timeline-aside__empty">
                    <span className="mda-timeline-aside__empty-icon" aria-hidden="true">
                      <DocumentRegular fontSize={32} />
                    </span>
                    <h3 className="mda-timeline-aside__empty-title">Get started</h3>
                    <p className="mda-timeline-aside__empty-text">
                      Capture and manage all records in your timeline.
                    </p>
                    <p className="mda-timeline-aside__empty-meta">
                      Record created on {createdShort}
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
