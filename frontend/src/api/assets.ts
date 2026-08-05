import { Asset } from "../types/asset";

// Options sent to the backend as query params, e.g.
// GET /api/assets?search=dell&category=Laptop
export interface AssetQueryParams {
  search?: string;
  category?: string;
}

// -----------------------------------------------------------------------
// Coordinate with Member 2 (owns backend/routes/assets.ts + assetController.ts):
// GET /api/assets currently ignores req.query. It needs to read
// req.query.search (match against name/serialNumber) and req.query.category
// (exact match) and filter the Mongo query server-side. Until that lands,
// this falls back to filtering the mock data client-side so the page still
// works end to end.
// -----------------------------------------------------------------------
export async function fetchAssets(params: AssetQueryParams = {}): Promise<Asset[]> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);

  try {
    const response = await fetch(`/api/assets?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return (data as any[]).map(normalizeAsset);
  } catch (error) {
    console.warn("Could not reach /api/assets, using mock data instead:", error);
    return filterMockAssets(params);
  }
}

function normalizeAsset(raw: any): Asset {
  return {
    id: raw.id ?? raw._id,
    name: raw.name,
    category: raw.category,
    status: raw.status,
    serialNumber: raw.serialNumber,
    purchaseDate: raw.purchaseDate,
  };
}

function filterMockAssets(params: AssetQueryParams): Asset[] {
  const search = (params.search ?? "").toLowerCase().trim();
  return MOCK_ASSETS.filter((asset) => {
    const matchesSearch =
      search === "" ||
      asset.name.toLowerCase().includes(search) ||
      (asset.serialNumber ?? "").toLowerCase().includes(search);
    const matchesCategory = !params.category || asset.category === params.category;
    return matchesSearch && matchesCategory;
  });
}

// Sample data so the Search/Filter/Export UI can be built and demoed
// before Member 2's backend is fully wired to a database.
export const MOCK_ASSETS: Asset[] = [
  { id: "A001", name: "ThinkPad T14", category: "Laptop", status: "Available", serialNumber: "LAP-0001", purchaseDate: "2024-02-15" },
  { id: "A002", name: "Dell UltraSharp 27", category: "Monitor", status: "Assigned", serialNumber: "MON-0001", purchaseDate: "2023-08-20" },
  { id: "A003", name: "MacBook Pro 14", category: "Laptop", status: "Available", serialNumber: "LAP-0002", purchaseDate: "2023-11-01" },
  { id: "A004", name: "Logitech Wireless Mouse", category: "Accessory", status: "Available", serialNumber: "ACC-0001", purchaseDate: "2024-01-10" },
  { id: "A005", name: "Microsoft Office 365", category: "Software", status: "Assigned", serialNumber: "SW-0001", purchaseDate: "2024-03-05" },
  { id: "A006", name: "HP EliteBook 840", category: "Laptop", status: "Maintenance", serialNumber: "LAP-0003", purchaseDate: "2022-09-12" },
  { id: "A007", name: "LG UltraWide Monitor", category: "Monitor", status: "Retired", serialNumber: "MON-0002", purchaseDate: "2021-05-30" },
];
