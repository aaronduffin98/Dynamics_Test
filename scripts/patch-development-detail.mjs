import fs from "fs";

const filePath = new URL("../src/DevelopmentDetailView.jsx", import.meta.url);
let c = fs.readFileSync(filePath, "utf8");

const re =
  /\{activeTab === "general" \? \([\s\S]*?\) : \([\s\S]*?\)\}\s*\n\s*<\/section>/;

const replacement = `{activeTab === "general" ? (
                    <motion className="mda-detail-columns">
                      <DetailRow label="Name" required>
                        <FluentInput readOnly value={development.name} className="mda-input" />
                      </DetailRow>
                      <DetailRow label="Location" required>
                        <FluentInput readOnly value={development.location} className="mda-input" />
                      </DetailRow>
                      <DetailRow label="Development ID">
                        <FluentInput readOnly value={development.developmentId} className="mda-input" />
                      </DetailRow>
                      <DetailRow label="Status">
                        <FluentInput readOnly value={development.status} className="mda-input" />
                      </DetailRow>
                      <DetailRow label="Total units">
                        <FluentInput readOnly value={String(development.totalUnits)} className="mda-input" />
                      </DetailRow>
                      <DetailRow label="Record created">
                        <FluentInput readOnly value={createdLabel} className="mda-input" />
                      </DetailRow>
                      <DetailRow label="Owner">
                        <div className="mda-detail-row__owner">
                          <Avatar name={development.ownerName} size={20} color="colorful" />
                          <FluentInput readOnly value={development.ownerName} className="mda-input mda-detail-row__owner-input" />
                        </div>
                      </DetailRow>
                    </div>
                  ) : (
                    <div className="mda-related-placeholder">
                      <p className="mda-related-placeholder__text">
                        Related properties, buyers, and contracts appear here in a full model-driven app. This prototype uses
                        the General tab for development information.
                      </p>
                    </div>
                  )}
                </section>`;

const fixed = replacement.replace(
  '<motion className="mda-detail-columns">',
  '<div className="mda-detail-columns">'
);

if (!re.test(c)) {
  console.error("Pattern not found");
  process.exit(1);
}
c = c.replace(re, fixed);
fs.writeFileSync(filePath, c);
console.log("patched");
