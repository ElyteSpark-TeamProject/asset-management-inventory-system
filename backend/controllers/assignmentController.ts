import { Request, Response } from "express";

// ==========================================
// MEMBER 3: ASSIGNMENT CONTROLLER
// Task: Link Assets to Users, handle return logic.
// ==========================================

export const getAssignments = async (req: Request, res: Response) => {
  // Mock data
  res.json([
    { id: 1, assetName: "ThinkPad T14", assignedTo: "John Doe", date: "2023-10-01" }
  ]);
};

export const assignAsset = async (req: Request, res: Response) => {
  res.status(201).json({ message: "Asset assigned (Mock)", data: req.body });
};

export const returnAsset = async (req: Request, res: Response) => {
  res.json({ message: `Assignment ${req.params.id} returned (Mock)` });
};
