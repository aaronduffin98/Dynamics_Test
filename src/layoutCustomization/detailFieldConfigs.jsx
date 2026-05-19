import { Avatar, Input as FluentInput } from "@fluentui/react-components";

export const DEVELOPMENT_DETAIL_FIELDS = [
  {
    id: "name",
    label: "Name",
    required: true,
    lockControlType: true,
    render: (d) => <FluentInput readOnly value={d.name} className="mda-input" />,
  },
  {
    id: "location",
    label: "Location",
    required: true,
    getDisplayValue: (d) => d.location,
    render: (d) => <FluentInput readOnly value={d.location} className="mda-input" />,
  },
  {
    id: "developmentId",
    label: "Development ID",
    getDisplayValue: (d) => d.developmentId,
    render: (d) => <FluentInput readOnly value={d.developmentId} className="mda-input" />,
  },
  {
    id: "status",
    label: "Status",
    getDisplayValue: (d) => d.status,
    render: (d) => <FluentInput readOnly value={d.status} className="mda-input" />,
  },
  {
    id: "totalUnits",
    label: "Total units",
    getDisplayValue: (d) => String(d.totalUnits),
    render: (d) => <FluentInput readOnly value={String(d.totalUnits)} className="mda-input" />,
  },
  {
    id: "createdOn",
    label: "Record created",
    getDisplayValue: (_d, ctx) => ctx.createdLabel ?? "",
    render: (d, ctx) => <FluentInput readOnly value={ctx.createdLabel ?? ""} className="mda-input" />,
  },
  {
    id: "owner",
    label: "Owner",
    lockControlType: true,
    render: (d) => (
      <div className="mda-detail-row__owner">
        <Avatar name={d.ownerName} size={20} color="colorful" />
        <FluentInput readOnly value={d.ownerName} className="mda-input mda-detail-row__owner-input" />
      </div>
    ),
  },
];

export const PROPERTY_DETAIL_FIELDS = [
  {
    id: "propertyId",
    label: "Property ID",
    required: true,
    getDisplayValue: (p) => p.propertyId,
    render: (p) => <FluentInput readOnly value={p.propertyId} className="mda-input" />,
  },
  {
    id: "type",
    label: "Type",
    required: true,
    getDisplayValue: (p) => p.type,
    render: (p) => <FluentInput readOnly value={p.type} className="mda-input" />,
  },
  {
    id: "bedrooms",
    label: "Bedrooms",
    required: true,
    getDisplayValue: (p) => String(p.bedrooms ?? ""),
    render: (p) => <FluentInput readOnly value={String(p.bedrooms ?? "")} className="mda-input" />,
  },
  {
    id: "price",
    label: "Price",
    required: true,
    getDisplayValue: (_p, ctx) => ctx.priceLabel ?? "",
    render: (p, ctx) => <FluentInput readOnly value={ctx.priceLabel ?? ""} className="mda-input" />,
  },
  {
    id: "status",
    label: "Status",
    required: true,
    getDisplayValue: (p) => p.status,
    render: (p) => <FluentInput readOnly value={p.status} className="mda-input" />,
  },
  {
    id: "development",
    label: "Development",
    lockControlType: true,
    render: (p, ctx) => (
      <button
        type="button"
        className="dynamics-grid-link"
        onClick={() => ctx.onOpenDevelopment?.(p.developmentId)}
      >
        {p.developmentName}
      </button>
    ),
  },
  {
    id: "developmentId",
    label: "Development ID",
    getDisplayValue: (p) => p.developmentId,
    render: (p) => <FluentInput readOnly value={p.developmentId} className="mda-input" />,
  },
];

export const BUYER_DETAIL_FIELDS = [
  {
    id: "buyerId",
    label: "Buyer ID",
    required: true,
    getDisplayValue: (b) => b.buyerId,
    render: (b) => <FluentInput readOnly value={b.buyerId} className="mda-input" />,
  },
  {
    id: "fullName",
    label: "Name",
    required: true,
    lockControlType: true,
    render: (b) => <FluentInput readOnly value={b.fullName} className="mda-input" />,
  },
  {
    id: "email",
    label: "Email",
    required: true,
    getDisplayValue: (b) => b.email,
    render: (b) => <FluentInput readOnly value={b.email} className="mda-input" />,
  },
  {
    id: "phone",
    label: "Phone",
    required: true,
    getDisplayValue: (b) => b.phone,
    render: (b) => <FluentInput readOnly value={b.phone} className="mda-input" />,
  },
  {
    id: "interestedDevelopment",
    label: "Interested development",
    lockControlType: true,
    render: (b, ctx) => (
      <button
        type="button"
        className="dynamics-grid-link"
        onClick={() => ctx.onOpenDevelopment?.(b.interestedDevelopmentId)}
      >
        {b.interestedDevelopmentName}
      </button>
    ),
  },
  {
    id: "interestedDevelopmentId",
    label: "Development ID",
    getDisplayValue: (b) => b.interestedDevelopmentId,
    render: (b) => <FluentInput readOnly value={b.interestedDevelopmentId} className="mda-input" />,
  },
];

export const CONTRACT_DETAIL_FIELDS = [
  {
    id: "contractId",
    label: "Contract ID",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    getDisplayValue: (c) => c.contractId,
    render: (c) => <FluentInput readOnly value={c.contractId} className="mda-input" />,
  },
  {
    id: "status",
    label: "Status",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    getDisplayValue: (c) => c.status,
    render: (c) => <FluentInput readOnly value={c.status} className="mda-input" />,
  },
  {
    id: "contractDate",
    label: "Date",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    getDisplayValue: (_c, ctx) => ctx.contractDateLabel ?? "",
    render: (c, ctx) => <FluentInput readOnly value={ctx.contractDateLabel ?? ""} className="mda-input" />,
  },
  {
    id: "buyerName",
    label: "Buyer",
    required: true,
    section: "relationships",
    sectionLabel: "Relationships",
    getDisplayValue: (c) => c.buyerName,
    render: (c) => <FluentInput readOnly value={c.buyerName} className="mda-input" />,
  },
  {
    id: "buyerId",
    label: "Buyer ID",
    section: "relationships",
    sectionLabel: "Relationships",
    getDisplayValue: (c) => c.buyerId,
    render: (c) => <FluentInput readOnly value={c.buyerId} className="mda-input" />,
  },
  {
    id: "propertyLabel",
    label: "Property",
    required: true,
    section: "relationships",
    sectionLabel: "Relationships",
    getDisplayValue: (c) => c.propertyLabel,
    render: (c) => <FluentInput readOnly value={c.propertyLabel} className="mda-input" />,
  },
  {
    id: "propertyId",
    label: "Property ID",
    section: "relationships",
    sectionLabel: "Relationships",
    getDisplayValue: (c) => c.propertyId,
    render: (c) => <FluentInput readOnly value={c.propertyId} className="mda-input" />,
  },
];

export const SALES_STAFF_DETAIL_FIELDS = [
  {
    id: "name",
    label: "Name",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    lockControlType: true,
    render: (s) => <FluentInput readOnly value={s.name} className="mda-input" />,
  },
  {
    id: "role",
    label: "Role",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    getDisplayValue: (s) => s.role,
    render: (s) => <FluentInput readOnly value={s.role} className="mda-input" />,
  },
  {
    id: "email",
    label: "Email",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    getDisplayValue: (s) => s.email,
    render: (s) => <FluentInput readOnly value={s.email} className="mda-input" />,
  },
  {
    id: "assignedDevelopmentName",
    label: "Assigned Development",
    required: true,
    section: "organisation",
    sectionLabel: "Organisation Details",
    getDisplayValue: (s) => s.assignedDevelopmentName,
    render: (s) => <FluentInput readOnly value={s.assignedDevelopmentName} className="mda-input" />,
  },
  {
    id: "createdOn",
    label: "Created On",
    section: "organisation",
    sectionLabel: "Organisation Details",
    getDisplayValue: (_s, ctx) => ctx.createdLabel ?? "",
    render: (s, ctx) => <FluentInput readOnly value={ctx.createdLabel ?? ""} className="mda-input" />,
  },
];
