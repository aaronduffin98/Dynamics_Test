import { useCallback, useMemo, useState } from "react";
import { Input as FluentInput } from "@fluentui/react-components";
import { allocateContractId } from "./idAllocators.js";
import { DetailRow, IntakeFormLayout, dateLong } from "./intakeFormShared.jsx";

const STATUSES = ["Draft", "Signed", "Completed"];
const FORM_ID = "new-contract-form";

function toDateInputValue(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function NewContractForm({
  existingContracts,
  buyers,
  properties,
  onSubmit,
  onCancel,
  onNavigateDevelopments,
  onNavigateProperties,
  onNavigateBuyers,
  onNavigateContracts,
  onNavigateSalesStaff,
  sitemapCollapsed,
  onToggleSitemap,
}) {
  const [buyerId, setBuyerId] = useState(() => buyers[0]?.buyerId ?? "");
  const [propertyId, setPropertyId] = useState(() => properties[0]?.propertyId ?? "");
  const [status, setStatus] = useState("Draft");
  const [contractDate, setContractDate] = useState(() => toDateInputValue(new Date()));
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const draftStartedOn = useMemo(() => new Date(), []);
  const previewId = useMemo(() => allocateContractId(existingContracts), [existingContracts]);
  const createdLabel = useMemo(() => dateLong.format(draftStartedOn), [draftStartedOn]);

  const selectedBuyer = useMemo(() => buyers.find((b) => b.buyerId === buyerId) ?? null, [buyers, buyerId]);
  const selectedProperty = useMemo(
    () => properties.find((p) => p.propertyId === propertyId) ?? null,
    [properties, propertyId]
  );

  const validationMessage = useMemo(() => {
    if (!attemptedSubmit) return {};
    const msg = {};
    if (!buyerId) msg.buyer = "Select a buyer.";
    if (!propertyId) msg.property = "Select a property.";
    if (!contractDate) msg.contractDate = "Enter a contract date.";
    return msg;
  }, [attemptedSubmit, buyerId, propertyId, contractDate]);

  const runSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      setAttemptedSubmit(true);
      if (!buyerId || !propertyId || !contractDate) return;
      if (!selectedBuyer || !selectedProperty) return;

      const propertyLabel = `${selectedProperty.propertyId} — ${selectedProperty.type} (${selectedProperty.developmentName})`;

      onSubmit({
        contractId: allocateContractId(existingContracts),
        buyerId,
        buyerName: selectedBuyer.fullName,
        propertyId,
        propertyLabel,
        status,
        contractDate: new Date(`${contractDate}T12:00:00`),
        createdOn: new Date(),
      });
    },
    [existingContracts, buyerId, propertyId, status, contractDate, selectedBuyer, selectedProperty, onSubmit]
  );

  return (
    <IntakeFormLayout
      activeEntity="contracts"
      previewId={previewId}
      entityLabel="Contract"
      formId={FORM_ID}
      onCancel={onCancel}
      onSubmit={runSubmit}
      draftStartedOn={draftStartedOn}
      timelineHint="Add notes and activities to build this contract's timeline."
      summaryFields={[
        { primary: selectedBuyer?.fullName ?? "—", secondary: "Buyer" },
        { primary: selectedProperty?.propertyId ?? "—", secondary: "Property" },
        { primary: status, secondary: "Status" },
      ]}
      onNavigateDevelopments={onNavigateDevelopments}
      onNavigateProperties={onNavigateProperties}
      onNavigateBuyers={onNavigateBuyers}
      onNavigateContracts={onNavigateContracts}
      onNavigateSalesStaff={onNavigateSalesStaff}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <DetailRow label="Buyer" required error={validationMessage.buyer}>
        <select className="mda-select" value={buyerId} onChange={(e) => setBuyerId(e.target.value)} aria-label="Buyer">
          <option value="">Select buyer…</option>
          {buyers.map((b) => (
            <option key={b.buyerId} value={b.buyerId}>
              {b.buyerId} — {b.fullName}
            </option>
          ))}
        </select>
      </DetailRow>
      <DetailRow label="Property" required error={validationMessage.property}>
        <select
          className="mda-select"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          aria-label="Property"
        >
          <option value="">Select property…</option>
          {properties.map((p) => (
            <option key={p.propertyId} value={p.propertyId}>
              {p.propertyId} — {p.address}
            </option>
          ))}
        </select>
      </DetailRow>
      <DetailRow label="Contract ID">
        <FluentInput readOnly value={previewId} className="mda-input" />
      </DetailRow>
      <DetailRow label="Status" required>
        <select className="mda-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </DetailRow>
      <DetailRow label="Contract date" required error={validationMessage.contractDate}>
        <FluentInput type="date" value={contractDate} onChange={(_, d) => setContractDate(d.value)} className="mda-input" />
      </DetailRow>
      <DetailRow label="Record created">
        <FluentInput readOnly value={createdLabel} className="mda-input" />
      </DetailRow>
    </IntakeFormLayout>
  );
}
