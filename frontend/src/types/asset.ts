// Shape of one asset record, matching Member 2's backend Asset model
// (backend/models/Asset.ts). Keep this in sync with their API response —
// if they add/rename a field, update it here too.
export interface Asset {
  id: string; // Mongo _id, or the mock "A001" style id
  name: string; // e.g. "Dell Latitude 5420"
  category: string; // e.g. "Laptop", "Monitor", "Accessory"
  status: "Available" | "Assigned" | "Maintenance" | "Retired";
  serialNumber?: string;
  purchaseDate?: string; // ISO date string, e.g. "2024-02-15"
}
