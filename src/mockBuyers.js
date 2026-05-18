import { mockDevelopments } from "./mockDevelopments.js";

function developmentRef(developmentId) {
  const d = mockDevelopments.find((x) => x.developmentId === developmentId);
  if (!d) {
    throw new Error(`Unknown developmentId: ${developmentId}`);
  }
  return {
    interestedDevelopmentId: developmentId,
    interestedDevelopmentName: d.name,
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

const BUYER_STATUSES = ["Prospect", "Reserved", "Purchased"];

/**
 * Mock buyer leads; each row references a development from `mockDevelopments`.
 */
export const mockBuyers = (() => {
  let idNum = 70001;
  const rows = [];
  for (let i = 0; i < 28; i += 1) {
    const dev = mockDevelopments[i % mockDevelopments.length];
    const gn = givenNames[i % givenNames.length];
    const sn = familyNames[i % familyNames.length];
    const slug = `${gn}.${sn}`.toLowerCase().replace(/[^a-z.]/g, "");
    rows.push({
      buyerId: `BUY-${String(idNum).padStart(5, "0")}`,
      fullName: `${gn} ${sn}`,
      email: `${slug}@inbox.example.com`,
      phone: `+353 1 ${String(400 + (i % 600)).padStart(3, "0")} ${String(2000 + (i % 8000)).padStart(4, "0")}`,
      status: BUYER_STATUSES[i % BUYER_STATUSES.length],
      ...developmentRef(dev.developmentId),
      createdOn: new Date(Date.UTC(2026, (i % 4) + 1, (i % 26) + 1, 11, 30, 0)),
    });
    idNum += 1;
  }
  return rows;
})();
