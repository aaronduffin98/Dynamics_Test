import fs from "fs";

const patches = [
  [
    "src/PropertiesGrid.jsx",
    [
      [
        "  onOpenProperty,\n  onNavigateDevelopments,",
        "  onOpenProperty,\n  onOpenNewProperty,\n  onNavigateDevelopments,",
      ],
      ["onClick={() => onOpenApplication?.()}", "onClick={() => onOpenNewProperty?.()}"],
      [
        "title=\"Create a new development via application\"",
        "title=\"Create a new property\"",
      ],
    ],
  ],
  [
    "src/SalesStaffGrid.jsx",
    [
      [
        "  onOpenSalesStaff,\n  onNavigateDevelopments,",
        "  onOpenSalesStaff,\n  onOpenNewSalesStaff,\n  onNavigateDevelopments,",
      ],
      [
        'onClick={onMockCommand} title="Preview only — new record"',
        'onClick={() => onOpenNewSalesStaff?.()} title="Create new sales staff"',
      ],
    ],
  ],
];

for (const [file, reps] of patches) {
  let c = fs.readFileSync(file, "utf8");
  for (const [from, to] of reps) {
    if (!c.includes(from)) {
      console.warn("pattern not found in", file, JSON.stringify(from.slice(0, 50)));
    }
    c = c.split(from).join(to);
  }
  fs.writeFileSync(file, c, "utf8");
  console.log("patched", file);
}
