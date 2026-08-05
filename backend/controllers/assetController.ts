import { Request, Response } from "express";
import { Asset } from "../models/Asset";
import mongoose from "mongoose";
import { mockDb } from "../data/mockDb";

// ==========================================
// MEMBER 2: ASSET CONTROLLER
// Task: Implement CRUD for Assets.
// Safeguard: Returns mock assets list for now.
// ==========================================

export const getAssets = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;
    
    if (mongoose.connection.readyState === 1) {
      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { serialNumber: { $regex: search, $options: "i" } }
        ];
      }
      if (category && category !== "All") {
        query.category = category;
      }
      
      const assets = await Asset.find(query).sort({ createdAt: -1 });
      res.json(assets);
    } else {
      let filtered = [...mockDb.assets];
      if (search) {
        const searchLower = (search as string).toLowerCase();
        filtered = filtered.filter((asset) =>
          asset.name.toLowerCase().includes(searchLower) ||
          (asset.serialNumber || "").toLowerCase().includes(searchLower)
        );
      }
      if (category && category !== "All") {
        filtered = filtered.filter((asset) => asset.category === category);
      }
      res.json(filtered);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createAsset = async (req: Request, res: Response) => {
  try {
    const { name, category, serialNumber, purchaseDate } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const asset = new Asset({ name, category, serialNumber, purchaseDate });
      await asset.save();
      res.status(201).json({ message: "Asset created successfully", asset });
    } else {
      const newAsset = {
        _id: `A00${mockDb.assets.length + 1}`,
        name, category, serialNumber, status: "Available", purchaseDate
      };
      mockDb.assets.unshift(newAsset);
      res.status(201).json({ message: "Asset created (Mock)", asset: newAsset });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, serialNumber, status, purchaseDate } = req.body;

    if (mongoose.connection.readyState === 1) {
      const asset = await Asset.findByIdAndUpdate(
        id,
        { name, category, serialNumber, status, purchaseDate },
        { new: true }
      );
      if (!asset) {
        res.status(404).json({ message: "Asset not found" });
        return;
      }
      res.json({ message: "Asset updated successfully", asset });
    } else {
      const index = mockDb.assets.findIndex(a => a._id === id);
      if (index === -1) {
        res.status(404).json({ message: "Asset not found (Mock)" });
        return;
      }
      mockDb.assets[index] = { ...mockDb.assets[index], name, category, serialNumber, status, purchaseDate };
      res.json({ message: "Asset updated (Mock)", asset: mockDb.assets[index] });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const asset = await Asset.findByIdAndDelete(id);
      if (!asset) {
         res.status(404).json({ message: "Asset not found" });
         return;
      }
      res.json({ message: "Asset deleted successfully", id });
    } else {
      const index = mockDb.assets.findIndex(a => a._id === id);
      if (index === -1) {
        res.status(404).json({ message: "Asset not found (Mock)" });
        return;
      }
      mockDb.assets.splice(index, 1);
      res.json({ message: "Asset deleted (Mock)", id });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
