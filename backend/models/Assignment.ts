import mongoose from "mongoose";

// ==========================================
// MEMBER 3: ASSIGNMENT MODEL
// ==========================================
const assignmentSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin who assigned
  assignedDate: { type: Date, default: Date.now },
  returnDate: { type: Date }, // Null if currently assigned
  conditionOut: { type: String }, // Condition when assigned
  conditionIn: { type: String }, // Condition when returned
  status: { type: String, enum: ["Active", "Returned"], default: "Active" }
}, { timestamps: true });

export const Assignment = mongoose.model("Assignment", assignmentSchema);
