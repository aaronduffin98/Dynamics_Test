import { useMemo, useState } from "react";
import {
  AddRegular,
  ArrowLeftRegular,
  ArrowSortRegular,
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
  PersonAccountsRegular,
  PersonCircleRegular,
  PinRegular,
  QuestionCircleRegular,
  SaveRegular,
  SearchRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import { Avatar, Button as FluentButton, Input as FluentInput } from "@fluentui/react-components";
import PowerAppsAppLauncherIcon from "./PowerAppsAppLauncherIcon.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";
import "./IntakeForm.css";

export const dateLong = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeStyle: "short",
});

export const dateShort = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

export function DetailRow({ label, required, alignTop, error, children }) {
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

export function HeaderSummaryField({ primary, secondary, variant = "default", showAvatar, avatarName }) {
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
        {showAvatar && avatarName ? <Avatar name={avatarName} size={24} color="colorful" /> : null}
        {primaryEl}
      </div>
      <span className="mda-record-header__summary-caption">{secondary}</span>
    </div>
  );
}

const ENTITY_META = {
  developments: { label: "Development" },
  properties: { label: "Property" },
  buyers: { label: "Buyer" },
  contracts: { label: "Contract" },
  salesStaff: { label: "Sales Staff" },
};

export function IntakeFormLayout({
  activeEntity,
  previewId,
  entityLabel,
  summaryFields = [],
  formId,
  onCancel,
  onSubmit,
  timelineHint,
  draftStartedOn,
  children,
  onNavigateDevelopments,
  onNavigateProperties,
  onNavigateBuyers,
  onNavigateContracts,
  onNavigateSalesStaff,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const [activeTab, setActiveTab] = useState("general");
  const meta = ENTITY_META[activeEntity];
  const createdLabel = useMemo(() => dateLong.format(draftStartedOn), [draftStartedOn]);
  const createdShort = useMemo(() => dateShort.format(draftStartedOn), [draftStartedOn]);

  const sitemapItem = (entity, Icon, label, onNavigate) => (
    <li>
      <button
        type="button"
        className={`dynamics-sitemap__item${entity === activeEntity ? " dynamics-sitemap__item--active" : ""}`}
        onClick={() => onNavigate?.()}
      >
        <Icon className="dynamics-sitemap__icon" />
        <span className="dynamics-sitemap__label">{label}</span>
      </button>
    </li>
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
          <span className="dynamics-app-header__app">Property Management</span>
          <span className="dynamics-app-header__divider" aria-hidden="true" />
          <span className="dynamics-app-header__env">SANDBOX</span>
        </div>
        <div className="dynamics-app-header__actions">
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Search">
            <SearchRegular />
          </button>
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Help">
            <QuestionCircleRegular />
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
            {sitemapItem("developments", PeopleRegular, "Developments", onNavigateDevelopments)}
            {sitemapItem("properties", BuildingRegular, "Properties", onNavigateProperties)}
            {sitemapItem("buyers", PersonCircleRegular, "Buyers", onNavigateBuyers)}
            {sitemapItem("contracts", DocumentTextRegular, "Contracts", onNavigateContracts)}
            {sitemapItem("salesStaff", PersonAccountsRegular, "Sales Staff", onNavigateSalesStaff)}
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
            <FluentButton appearance="subtle" icon={<SaveRegular fontSize={16} />} type="submit" form={formId}>
              Save
            </FluentButton>
            <FluentButton
              appearance="subtle"
              icon={<SaveRegular fontSize={16} />}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSubmit(e);
              }}
            >
              Save &amp; Close
            </FluentButton>
          </div>

          <div className="mda-record-workspace">
            <form id={formId} className="mda-record-form mda-detail-page-layout" onSubmit={onSubmit} noValidate>
              <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="mda-intake-form-title">
                <header className="mda-record-header mda-record-header--detail">
                  <div className="mda-record-header__main">
                    <h2 id="mda-intake-form-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{previewId}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-unsaved">Not saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">{entityLabel ?? meta.label}</p>
                  </div>
                  {summaryFields.length > 0 ? (
                    <div className="mda-record-header__summary">
                      <div className="mda-record-header__context">
                        {summaryFields.map((field, i) => (
                          <HeaderSummaryField key={i} {...field} />
                        ))}
                      </div>
                    </div>
                  ) : null}
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
                </div>
              </section>

              <div className="mda-detail-record-grid">
                <section className="mda-record-card mda-record-card--form" aria-label="Record details">
                  {activeTab === "general" ? (
                    <div className="mda-detail-columns">{children}</div>
                  ) : (
                    <div className="mda-detail-related">
                      <p className="mda-app-related-hint">Related records will be available after the record is saved.</p>
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
                      <p className="mda-timeline-aside__empty-text">{timelineHint}</p>
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
