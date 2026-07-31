import { Request, Response } from "express";

// ==========================================
// MEMBER 5: REPORT CONTROLLER
// Task: Aggregate statistics for the dashboard.
// ==========================================

export const getStats = async (req: Request, res: Response) => {
  // Mock data for dashboard
  res.json({
    totalAssets: 1240,
    assigned: 980,
    available: 245,
    totalEmployees: 850
  });
};

export const getReport = async (req: Request, res: Response) => {
  res.json({ message: "CSV/PDF Report logic goes here" });
};
