import { useCallback, useMemo, useState } from "react";
import { Input as FluentInput } from "@fluentui/react-components";
import { allocatePropertyId } from "./idAllocators.js";
import { DetailRow, IntakeFormLayout, dateLong } from "./intakeFormShared.jsx";

const TYPES = ["Apartment", "House"];
const STATUSES = ["Available", "Reserved", "Sold"];
const FORM_ID = "new-property-form";

export default function NewPropertyForm({
  existingProperties,
  developments,
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
  const [developmentId, setDevelopmentId] = useState(() => developments[0]?.developmentId ?? "");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState("2");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const draftStartedOn = useMemo(() => new Date(), []);
  const previewId = useMemo(() => allocatePropertyId(existingProperties), [existingProperties]);
  const createdLabel = useMemo(() => dateLong.format(draftStartedOn), [draftStartedOn]);
  const selectedDev = useMemo(
    () => developments.find((d) => d.developmentId === developmentId) ?? null,
    [developments, developmentId]
  );

  const validationMessage = useMemo(() => {
    if (!attemptedSubmit) return {};
    const msg = {};
    if (!developmentId) msg.development = "Select a development.";
    if (!address.trim()) msg.address = "Enter an address.";
    const beds = Number(bedrooms);
    if (!bedrooms.trim() || Number.isNaN(beds) || beds < 0) msg.bedrooms = "Enter bedrooms.";
    const p = Number(price);
    if (!price.trim() || Number.isNaN(p) || p < 0) msg.price = "Enter a valid price.";
    return msg;
  }, [attemptedSubmit, developmentId, address, bedrooms, price]);

  const runSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      setAttemptedSubmit(true);
      if (!developmentId || !address.trim()) return;
      const beds = Number(bedrooms);
      const p = Number(price);
      if (Number.isNaN(beds) || Number.isNaN(p)) return;
      if (!selectedDev) return;

      onSubmit({
        propertyId: allocatePropertyId(existingProperties),
        address: address.trim(),
        developmentId,
        developmentName: selectedDev.name,
        type,
        bedrooms: beds,
        price: p,
        status,
        createdOn: new Date(),
      });
    },
    [existingProperties, developmentId, address, type, bedrooms, price, status, selectedDev, onSubmit]
  );

  return (
    <IntakeFormLayout
      activeEntity="properties"
      previewId={previewId}
      entityLabel="Property"
      formId={FORM_ID}
      onCancel={onCancel}
      onSubmit={runSubmit}
      draftStartedOn={draftStartedOn}
      timelineHint="Add notes and activities to build this property's timeline."
      summaryFields={[
        { primary: selectedDev?.name ?? "—", secondary: "Development" },
        { primary: type, secondary: "Type" },
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
      <DetailRow label="Development" required error={validationMessage.development}>
        <select
          className="mda-select"
          value={developmentId}
          onChange={(e) => setDevelopmentId(e.target.value)}
          aria-label="Development"
        >
          <option value="">Select development…</option>
          {developments.map((d) => (
            <option key={d.developmentId} value={d.developmentId}>
              {d.developmentId} — {d.name}
            </option>
          ))}
        </select>
      </DetailRow>
      <DetailRow label="Address" required error={validationMessage.address}>
        <FluentInput value={address} onChange={(_, d) => setAddress(d.value)} placeholder="Unit and street" className="mda-input" />
      </DetailRow>
      <DetailRow label="Property ID">
        <FluentInput readOnly value={previewId} className="mda-input" />
      </DetailRow>
      <DetailRow label="Type" required>
        <select className="mda-select" value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </DetailRow>
      <DetailRow label="Bedrooms" required error={validationMessage.bedrooms}>
        <FluentInput type="number" min={0} value={bedrooms} onChange={(_, d) => setBedrooms(d.value)} className="mda-input" />
      </DetailRow>
      <DetailRow label="Price" required error={validationMessage.price}>
        <FluentInput type="number" min={0} value={price} onChange={(_, d) => setPrice(d.value)} className="mda-input" />
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
      <DetailRow label="Record created">
        <FluentInput readOnly value={createdLabel} className="mda-input" />
      </DetailRow>
    </IntakeFormLayout>
  );
}
