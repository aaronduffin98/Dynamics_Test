import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "src");

const files = fs
  .readdirSync(srcDir)
  .filter(
    (f) =>
      /^(Properties|Buyers|Contracts|SalesStaff|Property|Buyer|Contract|Developments|Development)/.test(f) &&
      f.endsWith(".jsx")
  );

for (const name of files) {
  const fp = path.join(srcDir, name);
  let c = fs.readFileSync(fp, "utf8");
  if (c.charCodeAt(0) === 0xfeff) c = c.slice(1);

  c = c.replace(/onNavigateStudents/g, "onNavigateDevelopments");
  c = c.replace(/,\s*onNavigateStaff(?![A-Za-z])/g, "");
  c = c.replace(/,\s*onOpenApplication[^,)]*/g, "");
  c = c.replace(/,\s*onNavigateApplications[^,)]*/g, "");
  c = c.replace(/,\s*onNavigateDepartments[^,)]*/g, "");
  c = c.replace(/,\s*onNavigateCourses[^,)]*/g, "");
  c = c.replace(/,\s*onNavigateLecturers[^,)]*/g, "");
  c = c.replace(/,\s*courseLinks[^,)]*/g, "");
  c = c.replace(/,\s*lecturerLinks[^,)]*/g, "");
  c = c.replace(/import StudentRelatedGrids from "\.\/StudentRelatedGrids\.jsx";\r?\n/g, "");
  c = c.replace(/import \{ PROGRAM_COORDINATOR_NAME \} from "\.\/programCoordinator\.js";\r?\n/g, "");

  c = c.replace(
    /<StudentRelatedGrids[\s\S]*?\/>/g,
    `<p className="mda-related-placeholder__text">Related records appear here in a full model-driven app.</p>`
  );

  c = c.replace(/row\.staffId/g, "row.salesStaffId");
  c = c.replace(/a\.staffId/g, "a.salesStaffId");
  c = c.replace(/b\.staffId/g, "b.salesStaffId");
  c = c.replace(/item\.staffId/g, "item.salesStaffId");
  c = c.replace(/columnId: "staffId"/g, 'columnId: "salesStaffId"');
  c = c.replace(/"Staff ID"/g, '"Sales Staff ID"');

  fs.writeFileSync(fp, c, "utf8");
  console.log("pass2", name);
}
