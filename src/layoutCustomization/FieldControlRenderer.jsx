import { Input as FluentInput, Textarea } from "@fluentui/react-components";

function parseCheckboxValue(value) {
  if (value == null || value === "") return false;
  const normalized = String(value).trim().toLowerCase();
  return ["yes", "true", "1", "y", "on", "checked"].includes(normalized);
}

export default function FieldControlRenderer({ type, value, options = [], className = "mda-input" }) {
  const display = value == null || value === "" ? "—" : String(value);

  switch (type) {
    case "textarea":
      return <Textarea readOnly value={display} className={className} resize="vertical" rows={3} />;

    case "dropdown":
      return <FluentInput readOnly value={display} className={className} />;

    case "phone":
      return (
        <FluentInput
          readOnly
          type="tel"
          value={display}
          className={`${className} mda-field-control--phone`}
        />
      );

    case "email":
      return (
        <FluentInput
          readOnly
          type="email"
          value={display}
          className={`${className} mda-field-control--email`}
        />
      );

    case "url":
      return (
        <a href={display === "—" ? undefined : display} className="dynamics-grid-link mda-field-control--url">
          {display}
        </a>
      );

    case "number":
      return (
        <FluentInput
          readOnly
          value={display}
          className={`${className} mda-field-control--number`}
          input={{ style: { textAlign: "right" } }}
        />
      );

    case "currency":
      return (
        <div className="mda-field-control--currency">
          <span className="mda-field-control--currency-prefix" aria-hidden="true">
            £
          </span>
          <FluentInput readOnly value={display} className={className} />
        </div>
      );

    case "date":
      return (
        <FluentInput
          readOnly
          value={display}
          className={`${className} mda-field-control--date`}
        />
      );

    case "checkbox":
      return (
        <FluentInput
          readOnly
          value={parseCheckboxValue(value) ? "Yes" : "No"}
          className={className}
        />
      );

    case "text":
    default:
      return <FluentInput readOnly value={display} className={className} />;
  }
}
