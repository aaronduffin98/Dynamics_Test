import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import BuyerDetailView from "./BuyerDetailView.jsx";
import BuyersGrid from "./BuyersGrid.jsx";
import ContractDetailView from "./ContractDetailView.jsx";
import ContractsGrid from "./ContractsGrid.jsx";
import DevelopmentDetailView from "./DevelopmentDetailView.jsx";
import DevelopmentsGrid from "./DevelopmentsGrid.jsx";
import NewBuyerForm from "./NewBuyerForm.jsx";
import NewContractForm from "./NewContractForm.jsx";
import NewDevelopmentForm from "./NewDevelopmentForm.jsx";
import NewPropertyForm from "./NewPropertyForm.jsx";
import NewSalesStaffForm from "./NewSalesStaffForm.jsx";
import PropertiesGrid from "./PropertiesGrid.jsx";
import PropertyDetailView from "./PropertyDetailView.jsx";
import SalesStaffDetailView from "./SalesStaffDetailView.jsx";
import SalesStaffGrid from "./SalesStaffGrid.jsx";
import { mockBuyers } from "./mockBuyers.js";
import { mockContracts } from "./mockContracts.js";
import { mockDevelopments } from "./mockDevelopments.js";
import { mockProperties } from "./mockProperties.js";
import { mockSalesStaff } from "./mockSalesStaff.js";

export default function App() {
  const [developments, setDevelopments] = useState(() => [...mockDevelopments]);
  const [properties, setProperties] = useState(() => [...mockProperties]);
  const [buyers, setBuyers] = useState(() => [...mockBuyers]);
  const [contracts, setContracts] = useState(() => [...mockContracts]);
  const [salesStaff, setSalesStaff] = useState(() => [...mockSalesStaff]);

  const [view, setView] = useState({ type: "developments" });
  const [sitemapCollapsed, setSitemapCollapsed] = useState(false);
  const toggleSitemap = useCallback(() => {
    setSitemapCollapsed((prev) => !prev);
  }, []);

  const detailDevelopment = useMemo(() => {
    if (view.type !== "developmentDetail") return null;
    return developments.find((d) => d.developmentId === view.developmentId) ?? null;
  }, [view, developments]);

  useEffect(() => {
    if (view.type === "developmentDetail" && !detailDevelopment) {
      setView({ type: "developments" });
    }
  }, [view.type, view.developmentId, detailDevelopment]);

  const detailProperty = useMemo(() => {
    if (view.type !== "propertyDetail") return null;
    return properties.find((p) => p.propertyId === view.propertyId) ?? null;
  }, [view, properties]);

  const detailBuyer = useMemo(() => {
    if (view.type !== "buyerDetail") return null;
    return buyers.find((b) => b.buyerId === view.buyerId) ?? null;
  }, [view, buyers]);

  const detailContract = useMemo(() => {
    if (view.type !== "contractDetail") return null;
    return contracts.find((c) => c.contractId === view.contractId) ?? null;
  }, [view, contracts]);

  const detailSalesStaff = useMemo(() => {
    if (view.type !== "salesStaffDetail") return null;
    return salesStaff.find((s) => s.salesStaffId === view.salesStaffId) ?? null;
  }, [view, salesStaff]);

  const goDevelopmentsList = useCallback(() => setView({ type: "developments" }), []);
  const goPropertiesList = useCallback(() => setView({ type: "properties" }), []);
  const goBuyersList = useCallback(() => setView({ type: "buyers" }), []);
  const goContractsList = useCallback(() => setView({ type: "contracts" }), []);
  const goSalesStaffList = useCallback(() => setView({ type: "salesStaffList" }), []);

  const openDevelopment = useCallback((developmentId) => {
    setView({ type: "developmentDetail", developmentId });
  }, []);
  const closeDevelopment = useCallback(() => setView({ type: "developments" }), []);

  const openProperty = useCallback((propertyId) => {
    setView({ type: "propertyDetail", propertyId });
  }, []);
  const closeProperty = useCallback(() => setView({ type: "properties" }), []);

  const openBuyer = useCallback((buyerId) => {
    setView({ type: "buyerDetail", buyerId });
  }, []);
  const closeBuyer = useCallback(() => setView({ type: "buyers" }), []);

  const openContract = useCallback((contractId) => {
    setView({ type: "contractDetail", contractId });
  }, []);
  const closeContract = useCallback(() => setView({ type: "contracts" }), []);

  const openSalesStaff = useCallback((salesStaffId) => {
    setView({ type: "salesStaffDetail", salesStaffId });
  }, []);
  const closeSalesStaff = useCallback(() => setView({ type: "salesStaffList" }), []);

  const openNewDevelopment = useCallback(() => setView({ type: "newDevelopment" }), []);
  const openNewProperty = useCallback(() => setView({ type: "newProperty" }), []);
  const openNewBuyer = useCallback(() => setView({ type: "newBuyer" }), []);
  const openNewContract = useCallback(() => setView({ type: "newContract" }), []);
  const openNewSalesStaff = useCallback(() => setView({ type: "newSalesStaff" }), []);

  const cancelNewDevelopment = useCallback(() => setView({ type: "developments" }), []);
  const cancelNewProperty = useCallback(() => setView({ type: "properties" }), []);
  const cancelNewBuyer = useCallback(() => setView({ type: "buyers" }), []);
  const cancelNewContract = useCallback(() => setView({ type: "contracts" }), []);
  const cancelNewSalesStaff = useCallback(() => setView({ type: "salesStaffList" }), []);

  const handleCreateDevelopment = useCallback((record) => {
    setDevelopments((prev) => [...prev, record]);
    setView({ type: "developments" });
  }, []);

  const handleCreateProperty = useCallback((record) => {
    setProperties((prev) => [...prev, record]);
    setView({ type: "properties" });
  }, []);

  const handleCreateBuyer = useCallback((record) => {
    setBuyers((prev) => [...prev, record]);
    setView({ type: "buyers" });
  }, []);

  const handleCreateContract = useCallback((record) => {
    setContracts((prev) => [...prev, record]);
    setView({ type: "contracts" });
  }, []);

  const handleCreateSalesStaff = useCallback((record) => {
    setSalesStaff((prev) => [...prev, record]);
    setView({ type: "salesStaffList" });
  }, []);

  const nav = {
    onNavigateDevelopments: goDevelopmentsList,
    onNavigateProperties: goPropertiesList,
    onNavigateBuyers: goBuyersList,
    onNavigateContracts: goContractsList,
    onNavigateSalesStaff: goSalesStaffList,
    sitemapCollapsed,
    onToggleSitemap: toggleSitemap,
  };

  return (
    <FluentProvider theme={webLightTheme}>
      {view.type === "newDevelopment" ? (
        <NewDevelopmentForm
          existingDevelopments={developments}
          onSubmit={handleCreateDevelopment}
          onCancel={cancelNewDevelopment}
          {...nav}
        />
      ) : view.type === "newProperty" ? (
        <NewPropertyForm
          existingProperties={properties}
          developments={developments}
          onSubmit={handleCreateProperty}
          onCancel={cancelNewProperty}
          {...nav}
        />
      ) : view.type === "newBuyer" ? (
        <NewBuyerForm
          existingBuyers={buyers}
          developments={developments}
          onSubmit={handleCreateBuyer}
          onCancel={cancelNewBuyer}
          {...nav}
        />
      ) : view.type === "newContract" ? (
        <NewContractForm
          existingContracts={contracts}
          buyers={buyers}
          properties={properties}
          onSubmit={handleCreateContract}
          onCancel={cancelNewContract}
          {...nav}
        />
      ) : view.type === "newSalesStaff" ? (
        <NewSalesStaffForm
          existingSalesStaff={salesStaff}
          developments={developments}
          onSubmit={handleCreateSalesStaff}
          onCancel={cancelNewSalesStaff}
          {...nav}
        />
      ) : detailDevelopment ? (
        <DevelopmentDetailView development={detailDevelopment} onBack={closeDevelopment} {...nav} />
      ) : detailProperty ? (
        <PropertyDetailView
          property={detailProperty}
          onBack={closeProperty}
          onOpenDevelopment={openDevelopment}
          {...nav}
        />
      ) : detailBuyer ? (
        <BuyerDetailView buyer={detailBuyer} onBack={closeBuyer} {...nav} />
      ) : detailContract ? (
        <ContractDetailView contract={detailContract} onBack={closeContract} {...nav} />
      ) : detailSalesStaff ? (
        <SalesStaffDetailView salesStaff={detailSalesStaff} onBack={closeSalesStaff} {...nav} />
      ) : view.type === "properties" ? (
        <PropertiesGrid
          properties={properties}
          onOpenProperty={openProperty}
          onOpenNewProperty={openNewProperty}
          {...nav}
        />
      ) : view.type === "buyers" ? (
        <BuyersGrid buyers={buyers} onOpenBuyer={openBuyer} onOpenNewBuyer={openNewBuyer} {...nav} />
      ) : view.type === "contracts" ? (
        <ContractsGrid contracts={contracts} onOpenContract={openContract} onOpenNewContract={openNewContract} {...nav} />
      ) : view.type === "salesStaffList" ? (
        <SalesStaffGrid
          salesStaff={salesStaff}
          onOpenSalesStaff={openSalesStaff}
          onOpenNewSalesStaff={openNewSalesStaff}
          {...nav}
        />
      ) : (
        <DevelopmentsGrid
          developments={developments}
          onOpenDevelopment={openDevelopment}
          onOpenNewDevelopment={openNewDevelopment}
          {...nav}
        />
      )}
    </FluentProvider>
  );
}
