import {
  AddSquareRegular,
  ArrowClockwiseRegular,
  BuildingRegular,
  ChevronDownRegular,
  ClockRegular,
  DocumentTextRegular,
  FilterRegular,
  HomeRegular,
  QuestionCircleRegular,
  LineHorizontal3Regular,
  PeopleRegular,
  PersonAccountsRegular,
  PersonCircleRegular,
  PinRegular,
  SearchRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import PowerAppsAppLauncherIcon from "../PowerAppsAppLauncherIcon.jsx";

/**
 * @param {object} props
 * @param {"home"|"developments"|"properties"|"buyers"|"contracts"|"salesStaff"} props.activeNav
 * @param {string} [props.appClassName] — extra classes on .dynamics-app (e.g. mda-detail-record)
 * @param {"list"|"detail"|"form"} [props.headerVariant]
 * @param {React.ReactNode} props.children
 */
export default function DynamicsAppShell({
  activeNav = "developments",
  appClassName = "",
  headerVariant = "list",
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
  const appClass = ["dynamics-app", sitemapCollapsed ? "dynamics-app--sitemap-collapsed" : "", appClassName]
    .filter(Boolean)
    .join(" ");

  const navItemClass = (key) =>
    ["dynamics-sitemap__item", activeNav === key ? "dynamics-sitemap__item--active" : ""]
      .filter(Boolean)
      .join(" ");

  return (
    <div className={appClass}>
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
          {headerVariant === "detail" ? (
            <>
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
            </>
          ) : headerVariant === "form" ? (
            <>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Help">
                <QuestionCircleRegular />
              </button>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Settings">
                <SettingsRegular />
              </button>
            </>
          ) : (
            <>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Refresh">
                <ArrowClockwiseRegular />
              </button>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Settings">
                <SettingsRegular />
              </button>
            </>
          )}
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
              <button type="button" className={navItemClass("home")} onClick={() => onNavigateHome?.()}>
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
              <button
                type="button"
                className={navItemClass("developments")}
                onClick={() => onNavigateDevelopments?.()}
              >
                <PeopleRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Developments</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={navItemClass("properties")}
                onClick={() => onNavigateProperties?.()}
              >
                <BuildingRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Properties</span>
              </button>
            </li>
            <li>
              <button type="button" className={navItemClass("buyers")} onClick={() => onNavigateBuyers?.()}>
                <PersonCircleRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Buyers</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={navItemClass("contracts")}
                onClick={() => onNavigateContracts?.()}
              >
                <DocumentTextRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Contracts</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={navItemClass("salesStaff")}
                onClick={() => onNavigateSalesStaff?.()}
              >
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

        {children}
      </div>
    </div>
  );
}
