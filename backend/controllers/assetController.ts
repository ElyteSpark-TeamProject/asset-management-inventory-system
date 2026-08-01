import { Request, Response } from "express";

// ==========================================
// MEMBER 2: ASSET CONTROLLER
// Task: Implement CRUD for Assets.
// Safeguard: Returns mock assets list for now.
// ==========================================

export const getAssets = async (req: Request, res: Response) => {
  const { search, category } = req.query;
  
  // TODO: Fetch from MongoDB
  let mockAssets = [
    { id: "A001", name: "ThinkPad T14", category: "Laptop", status: "Available", serialNumber: "LAP-0001", purchaseDate: "2024-02-15" },
    { id: "A002", name: "Dell UltraSharp 27", category: "Monitor", status: "Assigned", serialNumber: "MON-0001", purchaseDate: "2023-08-20" },
    { id: "A003", name: "MacBook Pro 14", category: "Laptop", status: "Available", serialNumber: "LAP-0002", purchaseDate: "2023-11-01" },
    { id: "A004", name: "Logitech Wireless Mouse", category: "Accessory", status: "Available", serialNumber: "ACC-0001", purchaseDate: "2024-01-10" },
    { id: "A005", name: "Microsoft Office 365", category: "Software", status: "Assigned", serialNumber: "SW-0001", purchaseDate: "2024-03-05" },
    { id: "A006", name: "HP EliteBook 840", category: "Laptop", status: "Maintenance", serialNumber: "LAP-0003", purchaseDate: "2022-09-12" },
    { id: "A007", name: "LG UltraWide Monitor", category: "Monitor", status: "Retired", serialNumber: "MON-0002", purchaseDate: "2021-05-30" },
  ];

  if (search) {
    const searchLower = (search as string).toLowerCase();
    mockAssets = mockAssets.filter((asset) =>
      asset.name.toLowerCase().includes(searchLower) ||
      (asset.serialNumber || "").toLowerCase().includes(searchLower)
    );
  }

  if (category && category !== "All") {
    mockAssets = mockAssets.filter((asset) => asset.category === category);
  }

  res.json(mockAssets);
};

export const createAsset = async (req: Request, res: Response) => {
  res.status(201).json({ message: "Asset created (Mock)", asset: req.body });
};

export const updateAsset = async (req: Request, res: Response) => {
  res.json({ message: `Asset ${req.params.id} updated (Mock)` });
};

export const deleteAsset = async (req: Request, res: Response) => {
  res.json({ message: `Asset ${req.params.id} deleted (Mock)` });
};
