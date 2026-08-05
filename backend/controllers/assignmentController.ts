import { Request, Response } from "express";
import { Assignment } from "../models/Assignment";
import { Asset } from "../models/Asset";
import { User } from "../models/User";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/authMiddleware";
import { mockDb } from "../data/mockDb";

export const getAssignments = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const assignments = await Assignment.find()
        .populate("asset", "name serialNumber category status")
        .populate("assignedTo", "name email department")
        .populate("assignedBy", "name")
        .sort({ createdAt: -1 });
      res.json(assignments);
    } else {
      res.json(mockDb.assignments);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const assignAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { assetId, assignedToId, conditionOut } = req.body;
    const assignedById = req.user?.userId;

    if (!assetId || !assignedToId) {
      res.status(400).json({ message: "Asset and User ID are required" });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      // Check if asset is available
      const asset = await Asset.findById(assetId);
      if (!asset) {
        res.status(404).json({ message: "Asset not found" });
        return;
      }
      if (asset.status !== "Available") {
        res.status(400).json({ message: "Asset is not available" });
        return;
      }

      const user = await User.findById(assignedToId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const assignment = new Assignment({
        asset: assetId,
        assignedTo: assignedToId,
        assignedBy: assignedById,
        conditionOut,
        status: "Active"
      });

      await assignment.save();
      
      // Update Asset Status
      asset.status = "Assigned";
      await asset.save();

      // Return the populated assignment
      const populatedAssignment = await Assignment.findById(assignment._id)
        .populate("asset", "name serialNumber")
        .populate("assignedTo", "name email")
        .populate("assignedBy", "name");

      res.status(201).json({ message: "Asset assigned successfully", data: populatedAssignment });
    } else {
      const asset = mockDb.assets.find(a => a._id === assetId);
      const user = mockDb.users.find(u => u._id === assignedToId);
      const admin = mockDb.users.find(u => u._id === assignedById) || mockDb.users.find(u => u.role === 'Admin');

      if (!asset) {
        res.status(404).json({ message: "Asset not found (Mock)" });
        return;
      }
      if (asset.status !== "Available") {
        res.status(400).json({ message: "Asset is not available (Mock)" });
        return;
      }
      if (!user) {
        res.status(404).json({ message: "User not found (Mock)" });
        return;
      }

      asset.status = "Assigned";

      const newAssignment: any = {
        _id: `a${Date.now()}`,
        asset: { _id: asset._id, name: asset.name, serialNumber: asset.serialNumber, category: asset.category, status: asset.status },
        assignedTo: { _id: user._id, name: user.name, email: user.email, department: user.department },
        assignedBy: { _id: admin?._id || "u1", name: admin?.name || "Admin Manager" },
        assignedDate: new Date().toISOString(),
        returnDate: null,
        conditionOut: conditionOut || "New",
        status: "Active"
      };
      
      mockDb.assignments.unshift(newAssignment);
      res.status(201).json({ message: "Asset assigned (Mock)", data: newAssignment });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const returnAsset = async (req: Request, res: Response) => {
  try {
    const { conditionIn } = req.body;
    const assignmentId = req.params.id;

    if (mongoose.connection.readyState === 1) {
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        res.status(404).json({ message: "Assignment not found" });
        return;
      }
      
      if (assignment.returnDate || assignment.status === "Returned") {
        res.status(400).json({ message: "Asset is already returned" });
        return;
      }

      assignment.returnDate = new Date();
      assignment.conditionIn = conditionIn || "Good";
      assignment.status = "Returned";
      await assignment.save();

      // Update Asset
      const asset = await Asset.findById(assignment.asset);
      if (asset) {
        asset.status = "Available";
        await asset.save();
      }

      res.json({ message: "Asset returned successfully", data: assignment });
    } else {
      const assignmentIndex = mockDb.assignments.findIndex(a => a._id === assignmentId);
      if (assignmentIndex === -1) {
        res.status(404).json({ message: "Assignment not found (Mock)" });
        return;
      }
      
      const assignment = mockDb.assignments[assignmentIndex];
      assignment.returnDate = new Date().toISOString() as any;
      assignment.conditionIn = conditionIn || "Good";
      assignment.status = "Returned";
      
      const asset = mockDb.assets.find(a => a._id === assignment.asset._id);
      if (asset) {
        asset.status = "Available";
        assignment.asset.status = "Available";
      }

      res.json({ message: `Assignment ${assignmentId} returned (Mock)`, data: assignment });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
