import { useCallback, useMemo, useState } from "react";
import { Button } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  CheckmarkRegular,
  ChevronDownRegular,
  SaveRegular,
  ShareRegular,
} from "@fluentui/react-icons";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import DashboardWidget from "./dashboard/DashboardWidget.jsx";
import DashboardWidgetTable from "./dashboard/DashboardWidgetTable.jsx";
import PieChart from "./dashboard/PieChart.jsx";
import StackedBarChart from "./dashboard/StackedBarChart.jsx";
import { DynamicsViewTitlePicker } from "./dynamicsListViewHelpers.jsx";
import {
  availablePropertiesTableRows,
  contractsStackedByBuyer,
  countDevelopmentsByStatus,
  recentContractsTableRows,
} from "./dashboard/dashboardMetrics.js";
import "./StudentsGrid.css";
import "./dashboard/HomeDashboard.css";

const DASHBOARD_VIEWS = [
  { id: "property", label: "Property Management Dashboard", isDefault: true },
  { id: "overview", label: "Property Overview", isDefault: false },
  { id: "sales", label: "Sales & Contracts Dashboard", isDefault: false },
];

const CONTRACT_COLUMNS = [
  { id: "contractId", label: "Contract ID" },
  { id: "buyerName", label: "Buyer" },
  { id: "propertyLabel", label: "Property" },
  { id: "status", label: "Status" },
  { id: "contractDate", label: "Contract Date" },
];

const PROPERTY_COLUMNS = [
  { id: "propertyId", label: "Property ID" },
  { id: "developmentName", label: "Development" },
  { id: "type", label: "Type" },
  { id: "status", label: "Status" },
  { id: "price", label: "Price" },
];

export default function HomeDashboard({
  properties,
  contracts,
  onOpenProperty,
  onOpenContract,
  onNavigateHome,
  onNavigateDevelopments,
  onNavigateProperties,
  onNavigateBuyers,
  onNavigateContracts,
  onNavigateSalesStaff,
  sitemapCollapsed,
  onToggleSitemap,
  developments,
}) {
  const [selectedDashboardId, setSelectedDashboardId] = useState(DASHBOARD_VIEWS[0].id);

  const devStatus = useMemo(() => countDevelopmentsByStatus(developments), [developments]);
  const stackedBuyers = useMemo(() => contractsStackedByBuyer(contracts), [contracts]);
  const contractRows = useMemo(() => recentContractsTableRows(contracts), [contracts]);
  const propertyRows = useMemo(() => availablePropertiesTableRows(properties), [properties]);

  const onMockCommand = useCallback(() => {}, []);

  const shellProps = {
    activeNav: "home",
    onNavigateHome,
    onNavigateDevelopments,
    onNavigateProperties,
    onNavigateBuyers,
    onNavigateContracts,
    onNavigateSalesStaff,
    sitemapCollapsed,
    onToggleSitemap,
  };

  return (
    <DynamicsAppShell {...shellProps}>
      <main className="dynamics-main">
        <div className="dynamics-main-surface">
          <div className="dynamics-surface-card dynamics-surface-card--command">
            <div className="dynamics-commandbar" role="toolbar" aria-label="Dashboard commands">
              <div className="dynamics-commandbar__scroll">
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Back">
                  <span className="dynamics-cmd-btn__inner">
                    <ArrowLeftRegular className="dynamics-cmd-btn__icon" />
                    <span>Back</span>
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Save dashboard as">
                  <span className="dynamics-cmd-btn__inner">
                    <SaveRegular className="dynamics-cmd-btn__icon" />
                    <span>Save As</span>
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Create new dashboard">
                  <span className="dynamics-cmd-btn__inner">
                    <AddRegular className="dynamics-cmd-btn__icon" />
                    <span>New</span>
                    <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Set as default dashboard">
                  <span className="dynamics-cmd-btn__inner">
                    <CheckmarkRegular className="dynamics-cmd-btn__icon" />
                    <span>Set As Default</span>
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Refresh all dashboard tiles">
                  <span className="dynamics-cmd-btn__inner">
                    <ArrowClockwiseRegular className="dynamics-cmd-btn__icon" />
                    <span>Refresh All</span>
                  </span>
                </Button>
              </div>
              <div className="dynamics-commandbar__right">
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Share dashboard">
                  <span className="dynamics-cmd-btn__inner">
                    <ShareRegular className="dynamics-cmd-btn__icon" />
                    <span>Share</span>
                    <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <div className="dynamics-surface-card dynamics-surface-card--view dashboard-surface-card">
            <section className="dynamics-view" aria-label="Dashboard">
              <div className="dynamics-view-toolbar dashboard-view-toolbar">
                <div className="dynamics-view-toolbar__title-wrap">
                  <DynamicsViewTitlePicker
                    views={DASHBOARD_VIEWS}
                    selectedViewId={selectedDashboardId}
                    onSelectViewId={setSelectedDashboardId}
                    onManageViews={onMockCommand}
                  />
                </div>
              </div>

              <div className="dashboard-view-body">
                <div className="dashboard-layout">
                  <div className="dashboard-layout__row dashboard-layout__row--charts">
                    <DashboardWidget title="Developments overview" subtitle="Status by development status">
                      <PieChart series={devStatus} legendTitle="Development status" />
                    </DashboardWidget>

                    <DashboardWidget title="Contracts overview" subtitle="Status by buyer">
                      <StackedBarChart bars={stackedBuyers} yLabel="Count (Status)" />
                    </DashboardWidget>
                  </div>

                  <div className="dashboard-layout__row dashboard-layout__row--tables">
                    <DashboardWidget title="Recent contracts">
                      <DashboardWidgetTable
                        columns={CONTRACT_COLUMNS}
                        rows={contractRows}
                        linkColumn="contractId"
                        onRowClick={onOpenContract}
                      />
                    </DashboardWidget>

                    <DashboardWidget title="Available properties">
                      <DashboardWidgetTable
                        columns={PROPERTY_COLUMNS}
                        rows={propertyRows}
                        linkColumn="propertyId"
                        onRowClick={onOpenProperty}
                      />
                    </DashboardWidget>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
