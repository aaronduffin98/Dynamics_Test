import { useCallback, useMemo, useState } from "react";
import { Input as FluentInput } from "@fluentui/react-components";
import { allocateSalesStaffId } from "./idAllocators.js";
import { DetailRow, IntakeFormLayout, dateLong } from "./intakeFormShared.jsx";

const ROLES = ["Account Executive", "Regional Sales Lead", "Sales Coordinator", "Show Home Specialist", "Aftercare Advisor"];
const FORM_ID = "new-sales-staff-form";

export default function NewSalesStaffForm({
  existingSalesStaff,
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
  const [name, setName] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [developmentId, setDevelopmentId] = useState(() => developments[0]?.developmentId ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const draftStartedOn = useMemo(() => new Date(), []);
  const previewId = useMemo(() => allocateSalesStaffId(existingSalesStaff), [existingSalesStaff]);
  const createdLabel = useMemo(() => dateLong.format(draftStartedOn), [draftStartedOn]);
  const selectedDev = useMemo(
    () => developments.find((d) => d.developmentId === developmentId) ?? null,
    [developments, developmentId]
  );

  const validationMessage = useMemo(() => {
    if (!attemptedSubmit) return {};
    const msg = {};
    if (!name.trim()) msg.name = "Enter a name.";
    if (!email.trim()) msg.email = "Enter an email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) msg.email = "Enter a valid email.";
    if (!developmentId) msg.development = "Select an assigned development.";
    return msg;
  }, [attemptedSubmit, name, email, developmentId]);

  const runSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      setAttemptedSubmit(true);
      if (!name.trim() || !email.trim() || !developmentId) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
      if (!selectedDev) return;

      onSubmit({
        salesStaffId: allocateSalesStaffId(existingSalesStaff),
        name: name.trim(),
        role,
        assignedDevelopmentId: developmentId,
        assignedDevelopmentName: selectedDev.name,
        email: email.trim(),
        phone: phone.trim() || "+353 1 000 0000",
        createdOn: new Date(),
      });
    },
    [existingSalesStaff, name, role, developmentId, email, phone, selectedDev, onSubmit]
  );

  return (
    <IntakeFormLayout
      activeEntity="salesStaff"
      previewId={previewId}
      entityLabel="Sales Staff"
      formId={FORM_ID}
      onCancel={onCancel}
      onSubmit={runSubmit}
      draftStartedOn={draftStartedOn}
      timelineHint="Add notes and activities to build this team member's timeline."
      summaryFields={[
        { primary: name || "—", secondary: "Name", showAvatar: Boolean(name), avatarName: name },
        { primary: role, secondary: "Role" },
        { primary: selectedDev?.name ?? "—", secondary: "Assigned development" },
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
      <DetailRow label="Role" required>
        <select className="mda-select" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role">
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </DetailRow>
      <DetailRow label="Assigned development" required error={validationMessage.development}>
        <select
          className="mda-select"
          value={developmentId}
          onChange={(e) => setDevelopmentId(e.target.value)}
          aria-label="Assigned development"
        >
          <option value="">Select development…</option>
          {developments.map((d) => (
            <option key={d.developmentId} value={d.developmentId}>
              {d.name}
            </option>
          ))}
        </select>
      </DetailRow>
      <DetailRow label="Email" required error={validationMessage.email}>
        <FluentInput
          type="email"
          value={email}
          onChange={(_, d) => setEmail(d.value)}
          placeholder="name@cairnhomes.example"
          className="mda-input"
        />
      </DetailRow>
      <DetailRow label="Phone">
        <FluentInput value={phone} onChange={(_, d) => setPhone(d.value)} placeholder="+353 …" className="mda-input" />
      </DetailRow>
      <DetailRow label="Sales staff ID">
        <FluentInput readOnly value={previewId} className="mda-input" />
      </DetailRow>
      <DetailRow label="Record created">
        <FluentInput readOnly value={createdLabel} className="mda-input" />
      </DetailRow>
    </IntakeFormLayout>
  );
}
