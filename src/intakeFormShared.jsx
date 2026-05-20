import { useMemo, useState } from "react";
import {
  ArrowLeftRegular,
  BuildingRegular,
  ChevronDownRegular,
  ClockRegular,
  DocumentTextRegular,
  HomeRegular,
  LineHorizontal3Regular,
  PeopleRegular,
  PersonAccountsRegular,
  PersonCircleRegular,
  PinRegular,
  QuestionCircleRegular,
  SaveRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import { Avatar, Button as FluentButton } from "@fluentui/react-components";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";
import "./IntakeForm.css";
import DetailRow from "./detailRecord/DetailRow.jsx";
import RecordTimelineAside from "./detailRecord/RecordTimelineAside.jsx";

export { DetailRow };

export const dateLong = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeStyle: "short",
});

export const dateShort = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

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
  onNavigateHome,
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

  const activeNavKey = {
    developments: "developments",
    properties: "properties",
    buyers: "buyers",
    contracts: "contracts",
    salesStaff: "salesStaff",
  }[activeEntity] ?? "developments";

  return (
    <DynamicsAppShell
      activeNav={activeNavKey}
      appClassName="mda-new-record mda-detail-record mda-application-form"
      headerVariant="form"
      onNavigateHome={onNavigateHome}
      onNavigateDevelopments={onNavigateDevelopments}
      onNavigateProperties={onNavigateProperties}
      onNavigateBuyers={onNavigateBuyers}
      onNavigateContracts={onNavigateContracts}
      onNavigateSalesStaff={onNavigateSalesStaff}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
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

                <RecordTimelineAside
                  emptyText={timelineHint}
                  recordMetaLabel={`Record draft started on ${createdShort}`}
                />
              </div>
            </form>
          </div>
        </main>
    </DynamicsAppShell>
  );
}
