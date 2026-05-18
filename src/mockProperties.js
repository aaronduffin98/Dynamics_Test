import { mockDevelopments } from "./mockDevelopments.js";

function developmentRef(developmentId) {
  const d = mockDevelopments.find((x) => x.developmentId === developmentId);
  if (!d) {
    throw new Error(`Unknown developmentId: ${developmentId}`);
  }
  return {
    developmentId,
    developmentName: d.name,
  };
}

const types = ["Apartment", "House"];
const statuses = ["Available", "Reserved", "Sold"];

/**
 * Mock property units; each row references a development from `mockDevelopments`.
 */
export const mockProperties = (() => {
  let idNum = 50001;
  const rows = [];
  for (const dev of mockDevelopments) {
    for (let u = 0; u < 2; u += 1) {
      const type = types[(idNum + u) % 2];
      const bedrooms = 1 + ((idNum + u) % 4);
      const price = 195000 + (idNum % 47) * 8200 + u * 15000;
      const status = statuses[(idNum + u) % 3];
      rows.push({
        propertyId: `PRP-${String(idNum).padStart(5, "0")}`,
        address: `Unit ${u + 1}, ${dev.name}`,
        ...developmentRef(dev.developmentId),
        type,
        bedrooms,
        price,
        status,
        createdOn: new Date(Date.UTC(2026, ((idNum + u) % 4) + 1, ((idNum + u) % 27) + 1, 10, 15, 0)),
      });
      idNum += 1;
    }
  }
  return rows;
})();
