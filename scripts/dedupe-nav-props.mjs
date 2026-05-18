import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

for (const name of fs.readdirSync(srcDir)) {
  if (!name.endsWith(".jsx")) continue;
  const fp = path.join(srcDir, name);
  let c = fs.readFileSync(fp, "utf8");
  const orig = c;
  while (/onNavigateSalesStaff,\s*\r?\n\s*onNavigateSalesStaff,/.test(c)) {
    c = c.replace(
      /(onNavigateSalesStaff,)\s*\r?\n\s*onNavigateSalesStaff,/,
      "$1"
    );
  }
  if (c !== orig) {
    fs.writeFileSync(fp, c, "utf8");
    console.log("deduped", name);
  }
}
