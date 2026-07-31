import { Request, Response } from "express";

// ==========================================
// MEMBER 2: ASSET CONTROLLER
// Task: Implement CRUD for Assets.
// Safeguard: Returns mock assets list for now.
// ==========================================

export const getAssets = async (req: Request, res: Response) => {
  // TODO: Fetch from MongoDB
  const mockAssets = [
    { id: "A001", name: "ThinkPad T14", category: "Laptop", status: "Available" },
    { id: "A002", name: "Dell UltraSharp 27", category: "Monitor", status: "Assigned" }
  ];
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
