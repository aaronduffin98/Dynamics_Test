import { useMemo, useState } from "react";
import {
  Avatar,
  Button as FluentButton,
  Input as FluentInput,
} from "@fluentui/react-components";
import {
  AddRegular,
  AddSquareRegular,
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  ArrowSortRegular,
  BookContactsRegular,
  BuildingRegular,
  ChevronDownRegular,
  ClockRegular,
  DeleteRegular,
  DocumentBulletListRegular,
  DocumentRegular,
  DocumentTextRegular,
  FilterRegular,
  FlowRegular,
  HomeRegular,
  LineHorizontal3Regular,
  MoreHorizontalRegular,
  PenRegular,
  PeopleRegular,
  PeopleTeamRegular,
  PersonAddRegular,
  PersonAccountsRegular,
  PersonCircleRegular,
  PersonRegular,
  PinRegular,
  ProhibitedRegular,
  QuestionCircleRegular,
  SaveRegular,
  SearchRegular,
  SettingsRegular,
  ShareRegular,
  ShieldCheckmarkRegular,
  TableRegular,
} from "@fluentui/react-icons";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import RecordTimelineAside from "./detailRecord/RecordTimelineAside.jsx";
import CustomizableCardGrid from "./layoutCustomization/CustomizableCardGrid.jsx";
import CustomizableFieldSection from "./layoutCustomization/CustomizableFieldSection.jsx";
import { PROPERTY_DETAIL_FIELDS } from "./layoutCustomization/detailFieldConfigs.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const dateShort = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const priceFmt = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

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

export default function PropertyDetailView({
  property,
  onBack,
  onNavigateHome,
  onNavigateDevelopments,
  onNavigateProperties,
  onNavigateBuyers,
  onNavigateContracts,
  onNavigateSalesStaff,
  onOpenDevelopment,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const [activeTab, setActiveTab] = useState("general");
  const createdShort = useMemo(() => dateShort.format(property.createdOn), [property.createdOn]);
  const priceLabel = useMemo(() => priceFmt.format(property.price ?? 0), [property.price]);

  return (
    <DynamicsAppShell
      activeNav="properties"
      appClassName="mda-new-record mda-detail-record"
      headerVariant="detail"
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
              onClick={onBack}
              type="button"
              aria-label="Back"
            />
            <FluentButton appearance="subtle" icon={<SaveRegular fontSize={16} />} type="button" disabled title="Preview only">
              Save
            </FluentButton>
            <FluentButton appearance="subtle" icon={<SaveRegular fontSize={16} />} type="button" disabled title="Preview only">
              Save &amp; Close
            </FluentButton>
            <FluentButton appearance="subtle" icon={<AddRegular fontSize={16} />} type="button" disabled title="Preview only">
              New
            </FluentButton>
            <FluentButton appearance="subtle" icon={<ProhibitedRegular fontSize={16} />} type="button" disabled title="Preview only">
              Deactivate
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
            <FluentButton
              appearance="subtle"
              icon={<TableRegular fontSize={16} />}
              iconPosition="before"
              type="button"
              disabled
              title="Preview only"
            >
              <span className="mda-commandbar__flow-label">
                Word Templates <ChevronDownRegular fontSize={12} />
              </span>
            </FluentButton>
            <FluentButton
              appearance="subtle"
              icon={<DocumentBulletListRegular fontSize={16} />}
              iconPosition="before"
              type="button"
              disabled
              title="Preview only"
            >
              <span className="mda-commandbar__flow-label">
                Run Report <ChevronDownRegular fontSize={12} />
              </span>
            </FluentButton>
            <span className="mda-record-commandbar__spacer" aria-hidden="true" />
            <FluentButton appearance="subtle" icon={<ShareRegular fontSize={16} />} iconPosition="before" type="button" disabled title="Preview only">
              <span className="mda-commandbar__flow-label">
                Share <ChevronDownRegular fontSize={12} />
              </span>
            </FluentButton>
          </div>

          <div className="mda-record-workspace">
            <div className="mda-record-form mda-detail-page-layout">
              <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="mda-detail-card-title">
                <header className="mda-record-header mda-record-header--detail">
                  <div className="mda-record-header__main">
                    <h2 id="mda-detail-card-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{property.propertyId}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Property</p>
                  </div>
                  <div className="mda-record-header__summary">
                    <div className="mda-record-header__context">
                      <HeaderSummaryField primary={property.developmentRegion ?? "—"} secondary="Region" />
                      <HeaderSummaryField
                        primary={property.developmentName}
                        secondary="Program coordinator"
                        variant="link"
                        showAvatar
                        avatarName={property.developmentName}
                      />
                      <HeaderSummaryField primary={priceLabel} secondary="List price" />
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

              <CustomizableCardGrid
                entityKey="property"
                cards={{
                  form: {
                    label: "Property details",
                    render: () => (
                      <section className="mda-record-card mda-record-card--form" aria-label="Property details">
                        {activeTab === "general" ? (
                          <CustomizableFieldSection
                            entityKey="property"
                            record={property}
                            fields={PROPERTY_DETAIL_FIELDS}
                            context={{ priceLabel, onOpenDevelopment }}
                          />
                        ) : (
                          <div className="mda-detail-related">
                            <p className="mda-related-placeholder__text">
                              Related records appear here in a full model-driven app.
                            </p>
                          </div>
                        )}
                      </section>
                    ),
                  },
                  timeline: {
                    label: "Timeline",
                    render: () => <RecordTimelineAside createdShort={createdShort} />,
                  },
                }}
              />
            </div>
          </div>
        </main>
    </DynamicsAppShell>
  );
}
