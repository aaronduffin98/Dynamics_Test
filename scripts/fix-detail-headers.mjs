import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

const fixes = {
  "BuyerDetailView.jsx": (c) =>
    c
      .replace(/PROGRAM_COORDINATOR_NAME/g, "buyer.fullName")
      .replace(/<StudentRelatedGrids[\s\S]*?\/>/g, '<p className="mda-related-placeholder__text">Related records appear here in a full model-driven app.</p>'),
  "PropertyDetailView.jsx": (c) =>
    c
      .replace(/PROGRAM_COORDINATOR_NAME/g, "property.developmentName")
      .replace(/<StudentRelatedGrids[\s\S]*?\/>/g, '<p className="mda-related-placeholder__text">Related records appear here in a full model-driven app.</p>'),
};

for (const [file, fn] of Object.entries(fixes)) {
  const fp = path.join(srcDir, file);
  fs.writeFileSync(fp, fn(fs.readFileSync(fp, "utf8")), "utf8");
  console.log("fixed", file);
}
