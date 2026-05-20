export default function DetailRow({ label, required, alignTop, error, children, className = "" }) {
  return (
    <div className={`mda-detail-row ${alignTop ? "mda-detail-row--top" : ""} ${className}`.trim()}>
      <label className="mda-detail-row__label">
        <span className="mda-detail-row__label-text">{label}</span>
      </label>
      <div className="mda-detail-row__control">
        <div className="mda-detail-row__control-field">
          <span className="mda-detail-row__req" aria-hidden="true">
            {required ? "*" : ""}
          </span>
          <div className="mda-detail-row__control-inner">{children}</div>
        </div>
        {error ? (
          <span className="mda-field__error" role="alert">
            {error}
          </span>
        ) : null}
      </div>
    </div>
  );
}
