import mongoose from "mongoose";

// ==========================================
// MEMBER 2: ASSET MODEL
// ==========================================

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Laptop, Monitor, Keyboard
  serialNumber: { type: String, unique: true },
  status: { type: String, enum: ["Available", "Assigned", "Maintenance", "Retired"], default: "Available" },
  purchaseDate: { type: Date },
}, { timestamps: true });

export const Asset = mongoose.model("Asset", assetSchema);
