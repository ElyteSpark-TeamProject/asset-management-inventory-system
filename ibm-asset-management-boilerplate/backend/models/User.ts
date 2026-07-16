import mongoose from "mongoose";

// ==========================================
// MEMBER 1 & 4: USER / EMPLOYEE MODEL
// ==========================================

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Employee"], default: "Employee" },
  department: { type: String },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
