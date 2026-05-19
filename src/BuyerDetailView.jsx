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
import PowerAppsAppLauncherIcon from "./PowerAppsAppLauncherIcon.jsx";
import RecordTimelineAside from "./detailRecord/RecordTimelineAside.jsx";
import CustomizableFieldSection from "./layoutCustomization/CustomizableFieldSection.jsx";
import { BUYER_DETAIL_FIELDS } from "./layoutCustomization/detailFieldConfigs.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const dateShort = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

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

export default function BuyerDetailView({
  buyer,
  onBack,
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
  const createdShort = useMemo(() => dateShort.format(buyer.createdOn), [buyer.createdOn]);

  return (
    <div className={`dynamics-app mda-new-record mda-detail-record ${sitemapCollapsed ? "dynamics-app--sitemap-collapsed" : ""}`}>
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
                    <p className="mda-sitemap__group-label">Administration</p>
          <ul className="dynamics-sitemap__list dynamics-sitemap__list--section">
            <li>
              <button type="button" className="dynamics-sitemap__item" onClick={() => onNavigateDevelopments?.()}>
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
              <button type="button" className="dynamics-sitemap__item dynamics-sitemap__item--active" onClick={() => onNavigateBuyers?.()}>
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
                      <span className="mda-record-header__title-id">{buyer.buyerId}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Buyer</p>
                  </div>
                  <div className="mda-record-header__summary">
                    <div className="mda-record-header__context">
                      <HeaderSummaryField primary={buyer.developmentRegion ?? "—"} secondary="Region" />
                      <HeaderSummaryField
                        primary={buyer.fullName}
                        secondary="Program coordinator"
                        variant="link"
                        showAvatar
                        avatarName={buyer.fullName}
                      />
                      <HeaderSummaryField primary={buyer.email ?? "—"} secondary="Email" />
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
                <section className="mda-record-card mda-record-card--form" aria-label="Buyer details">
                  {activeTab === "general" ? (
                    <CustomizableFieldSection
                      entityKey="buyer"
                      record={buyer}
                      fields={BUYER_DETAIL_FIELDS}
                      context={{ onOpenDevelopment }}
                    />
                  ) : (
                    <div className="mda-detail-related">
                      <p className="mda-related-placeholder__text">Related records appear here in a full model-driven app.</p>
                    </div>
                  )}
                </section>

                <RecordTimelineAside createdShort={createdShort} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
