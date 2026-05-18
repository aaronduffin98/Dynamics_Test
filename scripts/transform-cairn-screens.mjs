import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "src");

const sitemapBlock = `          <p className="mda-sitemap__group-label">Administration</p>
          <ul className="dynamics-sitemap__list dynamics-sitemap__list--section">
            <li>
              <button type="button" className="dynamics-sitemap__item{{DEV_ACTIVE}}" onClick={() => onNavigateDevelopments?.()}>
                <PeopleRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Developments</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item{{PROP_ACTIVE}}" onClick={() => onNavigateProperties?.()}>
                <BuildingRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Properties</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item{{BUY_ACTIVE}}" onClick={() => onNavigateBuyers?.()}>
                <PersonCircleRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Buyers</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item{{CTR_ACTIVE}}" onClick={() => onNavigateContracts?.()}>
                <DocumentTextRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Contracts</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item{{SS_ACTIVE}}" onClick={() => onNavigateSalesStaff?.()}>
                <PersonAccountsRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Sales Staff</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <SettingsRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Settings</span>
              </button>
            </li>
          </ul>`;

const activeMap = {
  developments: { DEV: " dynamics-sitemap__item--active", PROP: "", BUY: "", CTR: "", SS: "" },
  properties: { DEV: "", PROP: " dynamics-sitemap__item--active", BUY: "", CTR: "", SS: "" },
  buyers: { DEV: "", PROP: "", BUY: " dynamics-sitemap__item--active", CTR: "", SS: "" },
  contracts: { DEV: "", PROP: "", BUY: "", CTR: " dynamics-sitemap__item--active", SS: "" },
  salesStaff: { DEV: "", PROP: "", BUY: "", CTR: "", SS: " dynamics-sitemap__item--active" },
};

function sitemapFor(entity) {
  const a = activeMap[entity];
  return sitemapBlock
    .replace("{{DEV_ACTIVE}}", a.DEV)
    .replace("{{PROP_ACTIVE}}", a.PROP)
    .replace("{{BUY_ACTIVE}}", a.BUY)
    .replace("{{CTR_ACTIVE}}", a.CTR)
    .replace("{{SS_ACTIVE}}", a.SS);
}

function transformFile(name, entity) {
  const filePath = path.join(srcDir, name);
  let c = fs.readFileSync(filePath, "utf8");
  c = c.replace(/College Portal/g, "Property Management");
  c = c.replace(/onNavigateStudents/g, "onNavigateDevelopments");
  c = c.replace(/onOpenStudent/g, "onOpenDevelopment");
  c = c.replace(/onNavigateStaff/g, "onNavigateSalesStaff");
  c = c.replace(/\n\s*onNavigateApplications[^\n]*\n/g, "\n");
  c = c.replace(/\n\s*onNavigateDepartments[^\n]*\n/g, "\n");
  c = c.replace(/\n\s*onNavigateCourses[^\n]*\n/g, "\n");
  c = c.replace(/\n\s*onNavigateLecturers[^\n]*\n/g, "\n");
  c = c.replace(/\n\s*onOpenApplication[^\n]*\n/g, "\n");
  c = c.replace(/import StudentRelatedGrids from "\.\/StudentRelatedGrids\.jsx";\r?\n/g, "");
  c = c.replace(/import \{ PROGRAM_COORDINATOR_NAME \} from "\.\/programCoordinator\.js";\r?\n/g, "");
  c = c.replace(/@contoso\.edu/g, "@cairnhomes.example");
  c = c.replace(/ÔÇö/g, "—");

  const sitemapRe =
    /<p className="mda-sitemap__group-label">Dashboards<\/p>[\s\S]*?<p className="mda-sitemap__group-label">Configuration<\/p>[\s\S]*?<\/ul>\s*/;
  if (sitemapRe.test(c)) {
    c = c.replace(sitemapRe, `${sitemapFor(entity)}\n`);
  }

  fs.writeFileSync(filePath, c);
  console.log("transformed", name);
}

const files = [
  ["PropertiesGrid.jsx", "properties"],
  ["PropertyDetailView.jsx", "properties"],
  ["BuyersGrid.jsx", "buyers"],
  ["BuyerDetailView.jsx", "buyers"],
  ["ContractsGrid.jsx", "contracts"],
  ["ContractDetailView.jsx", "contracts"],
  ["SalesStaffGrid.jsx", "salesStaff"],
  ["SalesStaffDetailView.jsx", "salesStaff"],
];

for (const [name, entity] of files) {
  transformFile(name, entity);
}

for (const name of ["SalesStaffGrid.jsx", "SalesStaffDetailView.jsx"]) {
  const filePath = path.join(srcDir, name);
  let c = fs.readFileSync(filePath, "utf8");
  c = c.replace(/"Staff ID"/g, '"Sales Staff ID"');
  c = c.replace(/Open staff /g, "Open sales staff ");
  c = c.replace(/columnId: "staffId"/g, 'columnId: "salesStaffId"');
  c = c.replace(/getRowId=\{\(item\) => item\.staffId\}/g, "getRowId={(item) => item.salesStaffId}");
  c = c.replace(/onOpenSalesStaff\?\.\(item\.staffId\)/g, "onOpenSalesStaff?.(item.salesStaffId)");
  c = c.replace(/item\.staffId/g, "item.salesStaffId");
  c = c.replace(/row\.staffId/g, "row.salesStaffId");
  c = c.replace(/staffId:/g, "salesStaffId:");
  c = c.replace(/staff\./g, "salesStaff.");
  c = c.replace(/staff,/g, "salesStaff,");
  c = c.replace(/\(staff\)/g, "(salesStaff)");
  c = c.replace(/staff\}/g, "salesStaff}");
  c = c.replace(/staff =/g, "salesStaff =");
  fs.writeFileSync(filePath, c);
}

console.log("done");
