import { Request, Response } from "express";
import mongoose from "mongoose";
import { Asset } from "../models/Asset";
import { User } from "../models/User";
import { mockDb } from "../data/mockDb";

// ==========================================
// MEMBER 5: REPORT CONTROLLER
// Task: Aggregate statistics for the dashboard.
// ==========================================

export const getStats = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalAssets = await Asset.countDocuments();
      const assigned = await Asset.countDocuments({ status: "Assigned" });
      const available = await Asset.countDocuments({ status: "Available" });
      const maintenance = await Asset.countDocuments({ status: "Maintenance" });
      const retired = await Asset.countDocuments({ status: "Retired" });
      const totalEmployees = await User.countDocuments();

      // Aggregate by category
      const categoryData = await Asset.aggregate([
        { $group: { _id: "$category", value: { $sum: 1 } } }
      ]);
      const assetsByCategory = categoryData.map(d => ({ name: d._id, value: d.value }));

      res.json({
        totalAssets,
        assigned,
        available,
        totalEmployees,
        assetsByStatus: [
          { name: "Available", value: available, color: "#10b981" },
          { name: "Assigned", value: assigned, color: "#3b82f6" },
          { name: "Maintenance", value: maintenance, color: "#eab308" },
          { name: "Retired", value: retired, color: "#ef4444" }
        ],
        assetsByCategory
      });
    } else {
      // Mock data for dashboard from mockDb
      const totalAssets = mockDb.assets.length;
      const assigned = mockDb.assets.filter(a => a.status === 'Assigned').length;
      const available = mockDb.assets.filter(a => a.status === 'Available').length;
      const maintenance = mockDb.assets.filter(a => a.status === 'Maintenance').length;
      const retired = mockDb.assets.filter(a => a.status === 'Retired').length;
      const totalEmployees = mockDb.users.length;
      
      const categoryCounts = mockDb.assets.reduce((acc, asset) => {
        acc[asset.category] = (acc[asset.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const assetsByCategory = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

      res.json({
        totalAssets,
        assigned,
        available,
        totalEmployees,
        assetsByStatus: [
          { name: "Available", value: available, color: "#10b981" },
          { name: "Assigned", value: assigned, color: "#3b82f6" },
          { name: "Maintenance", value: maintenance, color: "#eab308" },
          { name: "Retired", value: retired, color: "#ef4444" }
        ],
        assetsByCategory
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getReport = async (req: Request, res: Response) => {
  res.json({ message: "CSV/PDF Report logic goes here" });
};
