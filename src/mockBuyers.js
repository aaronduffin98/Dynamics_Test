import { mockStudents } from "./mockStudents.js";

function developmentRef(developmentId) {
  const d = mockStudents.find((x) => x.studentId === developmentId);
  if (!d) {
    throw new Error(`Unknown developmentId: ${developmentId}`);
  }
  return {
    interestedDevelopmentId: developmentId,
    interestedDevelopmentName: d.fullName,
  };
}

const givenNames = [
  "Alex",
  "Sam",
  "Jordan",
  "Taylor",
  "Casey",
  "Riley",
  "Morgan",
  "Jamie",
  "Avery",
  "Quinn",
  "Blake",
  "Cameron",
  "Drew",
  "Ellis",
  "Harper",
];

const familyNames = [
  "Murray",
  "Patel",
  "O'Connor",
  "Hughes",
  "Khan",
  "Campbell",
  "Reid",
  "Singh",
  "Walsh",
  "Barnes",
  "Cole",
  "Foster",
  "Griffiths",
  "Hayes",
  "Ingram",
];

/**
 * Mock buyer leads; each row references a development from `mockStudents`.
 */
export const mockBuyers = (() => {
  let idNum = 70001;
  const rows = [];
  for (let i = 0; i < 28; i += 1) {
    const dev = mockStudents[i % mockStudents.length];
    const gn = givenNames[i % givenNames.length];
    const sn = familyNames[i % familyNames.length];
    const slug = `${gn}.${sn}`.toLowerCase().replace(/[^a-z.]/g, "");
    rows.push({
      buyerId: `BUY-${String(idNum).padStart(5, "0")}`,
      fullName: `${gn} ${sn}`,
      email: `${slug}@inbox.example.com`,
      phone: `+44 20 7946 ${String(2000 + (i % 8000)).padStart(4, "0")}`,
      ...developmentRef(dev.studentId),
      createdOn: new Date(Date.UTC(2026, (i % 4) + 1, (i % 26) + 1, 11, 30, 0)),
    });
    idNum += 1;
  }
  return rows;
})();
