import { mockBuyers } from "./mockBuyers.js";
import { mockProperties } from "./mockProperties.js";

const STATUSES = ["Draft", "Signed", "Completed"];

/**
 * Mock sales contracts; each row links a buyer and a property (display names stored as text).
 */
export const mockContracts = (() => {
  let idNum = 60001;
  const rows = [];
  for (let i = 0; i < 20; i += 1) {
    const buyer = mockBuyers[i % mockBuyers.length];
    const prop = mockProperties[i % mockProperties.length];
    rows.push({
      contractId: `CTR-${String(idNum).padStart(5, "0")}`,
      buyerId: buyer.buyerId,
      buyerName: buyer.fullName,
      propertyId: prop.propertyId,
      propertyLabel: `${prop.propertyId} — ${prop.type} (${prop.developmentName})`,
      status: STATUSES[i % STATUSES.length],
      contractDate: new Date(Date.UTC(2025, (i % 6) + 5, (i % 26) + 1, 14, 30, 0)),
      createdOn: new Date(Date.UTC(2026, (i % 4) + 1, (i % 22) + 1, 10, 0, 0)),
    });
    idNum += 1;
  }
  return rows;
})();
