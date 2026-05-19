import fs from "fs";

const p = "src/PropertiesGrid.jsx";
let c = fs.readFileSync(p, "utf8");
c = c.replace(/function statusClass\(status\) \{[\s\S]*?\}\r?\n\r?\nfunction StatusCell[\s\S]*?\}\r?\n\r?\n/g, "");
if (c.includes("StatusCell")) {
  c = c.replace(/function statusClass\(status\) \{[\s\S]*?\}\r?\nfunction StatusCell[\s\S]*?\}\r?\n/g, "");
}
fs.writeFileSync(p, c, "utf8");
console.log("done", !c.includes("StatusCell"));
