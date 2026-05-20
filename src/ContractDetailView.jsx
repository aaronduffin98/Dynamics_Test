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
  PersonAccountsRegular,
  PersonAddRegular,
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
import { CONTRACT_DETAIL_FIELDS } from "./layoutCustomization/detailFieldConfigs.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const dateLong = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeStyle: "short",
});

const dateShort = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
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

export default function ContractDetailView({
  contract,
  onBack,
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
  const contractDateLabel = useMemo(() => dateLong.format(contract.contractDate), [contract.contractDate]);
  const createdShort = useMemo(() => dateShort.format(contract.createdOn), [contract.createdOn]);

  return (
    <DynamicsAppShell
      activeNav="contracts"
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
              <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="mda-contract-detail-card-title">
                <header className="mda-record-header mda-record-header--detail">
                  <div className="mda-record-header__main">
                    <h2 id="mda-contract-detail-card-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{contract.contractId}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Contract</p>
                  </div>
                  <div className="mda-record-header__summary">
                    <div className="mda-record-header__context">
                      <HeaderSummaryField primary={contract.buyerName} secondary="Buyer" />
                      <HeaderSummaryField primary={contract.propertyLabel} secondary="Property" />
                      <HeaderSummaryField primary={contract.status} secondary="Status" />
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
                entityKey="contract"
                cards={{
                  form: {
                    label: "Contract details",
                    render: () => (
                      <section className="mda-record-card mda-record-card--form" aria-label="Contract details">
                        {activeTab === "general" ? (
                          <CustomizableFieldSection
                            entityKey="contract"
                            record={contract}
                            fields={CONTRACT_DETAIL_FIELDS}
                            context={{ contractDateLabel }}
                          />
                        ) : (
                          <div className="mda-detail-related">
                            <p className="mda-related-placeholder__text">No related records to show.</p>
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
