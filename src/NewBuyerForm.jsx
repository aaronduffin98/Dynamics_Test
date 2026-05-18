import { useCallback, useMemo, useState } from "react";
import { Input as FluentInput } from "@fluentui/react-components";
import { allocateBuyerId } from "./idAllocators.js";
import { DetailRow, IntakeFormLayout, dateLong } from "./intakeFormShared.jsx";

const STATUSES = ["Prospect", "Reserved", "Purchased"];
const FORM_ID = "new-buyer-form";

export default function NewBuyerForm({
  existingBuyers,
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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [developmentId, setDevelopmentId] = useState(() => developments[0]?.developmentId ?? "");
  const [status, setStatus] = useState("Prospect");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const draftStartedOn = useMemo(() => new Date(), []);
  const previewId = useMemo(() => allocateBuyerId(existingBuyers), [existingBuyers]);
  const createdLabel = useMemo(() => dateLong.format(draftStartedOn), [draftStartedOn]);
  const selectedDev = useMemo(
    () => developments.find((d) => d.developmentId === developmentId) ?? null,
    [developments, developmentId]
  );

  const validationMessage = useMemo(() => {
    if (!attemptedSubmit) return {};
    const msg = {};
    if (!fullName.trim()) msg.fullName = "Enter a name.";
    if (!email.trim()) msg.email = "Enter an email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) msg.email = "Enter a valid email.";
    if (!phone.trim()) msg.phone = "Enter a phone number.";
    if (!developmentId) msg.development = "Select an interested development.";
    return msg;
  }, [attemptedSubmit, fullName, email, phone, developmentId]);

  const runSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      setAttemptedSubmit(true);
      if (!fullName.trim() || !email.trim() || !phone.trim() || !developmentId) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
      if (!selectedDev) return;

      onSubmit({
        buyerId: allocateBuyerId(existingBuyers),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
        interestedDevelopmentId: developmentId,
        interestedDevelopmentName: selectedDev.name,
        createdOn: new Date(),
      });
    },
    [existingBuyers, fullName, email, phone, status, developmentId, selectedDev, onSubmit]
  );

  return (
    <IntakeFormLayout
      activeEntity="buyers"
      previewId={previewId}
      entityLabel="Buyer"
      formId={FORM_ID}
      onCancel={onCancel}
      onSubmit={runSubmit}
      draftStartedOn={draftStartedOn}
      timelineHint="Add notes and activities to build this buyer's timeline."
      summaryFields={[
        { primary: fullName || "—", secondary: "Name", showAvatar: Boolean(fullName), avatarName: fullName },
        { primary: selectedDev?.name ?? "—", secondary: "Interested development" },
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
      <DetailRow label="Full name" required error={validationMessage.fullName}>
        <FluentInput value={fullName} onChange={(_, d) => setFullName(d.value)} placeholder="Type here" className="mda-input" />
      </DetailRow>
      <DetailRow label="Email" required error={validationMessage.email}>
        <FluentInput
          type="email"
          value={email}
          onChange={(_, d) => setEmail(d.value)}
          placeholder="name@example.com"
          className="mda-input"
        />
      </DetailRow>
      <DetailRow label="Phone" required error={validationMessage.phone}>
        <FluentInput value={phone} onChange={(_, d) => setPhone(d.value)} placeholder="+353 …" className="mda-input" />
      </DetailRow>
      <DetailRow label="Buyer ID">
        <FluentInput readOnly value={previewId} className="mda-input" />
      </DetailRow>
      <DetailRow label="Interested development" required error={validationMessage.development}>
        <select
          className="mda-select"
          value={developmentId}
          onChange={(e) => setDevelopmentId(e.target.value)}
          aria-label="Interested development"
        >
          <option value="">Select development…</option>
          {developments.map((d) => (
            <option key={d.developmentId} value={d.developmentId}>
              {d.name}
            </option>
          ))}
        </select>
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
