import { useCallback, useMemo, useState } from "react";
import { Input as FluentInput } from "@fluentui/react-components";
import { allocateDevelopmentId } from "./idAllocators.js";
import { DetailRow, IntakeFormLayout, dateLong } from "./intakeFormShared.jsx";

const STATUSES = ["Planning", "Active", "Completed"];
const FORM_ID = "new-development-form";

export default function NewDevelopmentForm({
  existingDevelopments,
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
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Planning");
  const [totalUnits, setTotalUnits] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const draftStartedOn = useMemo(() => new Date(), []);
  const previewId = useMemo(() => allocateDevelopmentId(existingDevelopments), [existingDevelopments]);
  const createdLabel = useMemo(() => dateLong.format(draftStartedOn), [draftStartedOn]);

  const validationMessage = useMemo(() => {
    if (!attemptedSubmit) return {};
    const msg = {};
    if (!name.trim()) msg.name = "Enter a development name.";
    if (!location.trim()) msg.location = "Enter a location.";
    if (!ownerName.trim()) msg.ownerName = "Enter an owner.";
    const units = Number(totalUnits);
    if (!totalUnits.trim() || Number.isNaN(units) || units < 1) msg.totalUnits = "Enter a valid unit count.";
    return msg;
  }, [attemptedSubmit, name, location, ownerName, totalUnits]);

  const runSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      setAttemptedSubmit(true);
      if (!name.trim() || !location.trim() || !ownerName.trim()) return;
      const units = Number(totalUnits);
      if (!totalUnits.trim() || Number.isNaN(units) || units < 1) return;

      onSubmit({
        developmentId: allocateDevelopmentId(existingDevelopments),
        name: name.trim(),
        location: location.trim(),
        status,
        totalUnits: units,
        ownerName: ownerName.trim(),
        createdOn: new Date(),
      });
    },
    [existingDevelopments, name, location, status, totalUnits, ownerName, onSubmit]
  );

  return (
    <IntakeFormLayout
      activeEntity="developments"
      previewId={previewId}
      entityLabel="Development"
      formId={FORM_ID}
      onCancel={onCancel}
      onSubmit={runSubmit}
      draftStartedOn={draftStartedOn}
      timelineHint="Add notes and activities to build this development's timeline."
      summaryFields={[
        { primary: location || "—", secondary: "Location" },
        { primary: status, secondary: "Status" },
        { primary: ownerName || "—", secondary: "Owner", showAvatar: Boolean(ownerName), avatarName: ownerName },
      ]}
      onNavigateDevelopments={onNavigateDevelopments}
      onNavigateProperties={onNavigateProperties}
      onNavigateBuyers={onNavigateBuyers}
      onNavigateContracts={onNavigateContracts}
      onNavigateSalesStaff={onNavigateSalesStaff}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <DetailRow label="Name" required error={validationMessage.name}>
        <FluentInput value={name} onChange={(_, d) => setName(d.value)} placeholder="Type here" className="mda-input" />
      </DetailRow>
      <DetailRow label="Location" required error={validationMessage.location}>
        <FluentInput value={location} onChange={(_, d) => setLocation(d.value)} placeholder="City or region" className="mda-input" />
      </DetailRow>
      <DetailRow label="Development ID">
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
      <DetailRow label="Total units" required error={validationMessage.totalUnits}>
        <FluentInput
          type="number"
          min={1}
          value={totalUnits}
          onChange={(_, d) => setTotalUnits(d.value)}
          placeholder="e.g. 120"
          className="mda-input"
        />
      </DetailRow>
      <DetailRow label="Record created">
        <FluentInput readOnly value={createdLabel} className="mda-input" />
      </DetailRow>
      <DetailRow label="Owner" required error={validationMessage.ownerName}>
        <FluentInput value={ownerName} onChange={(_, d) => setOwnerName(d.value)} placeholder="Owner name" className="mda-input" />
      </DetailRow>
    </IntakeFormLayout>
  );
}
