import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import mongoose from "mongoose";
import { mockDb } from "../data/mockDb";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_boilerplate";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: "Name, email and password are required" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // If DB is connected
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "Employee",
        department
      });

      await user.save();
      res.status(201).json({ message: "User registered successfully" });
      return;
    } else {
      // Mock Data mode
      const exists = mockDb.users.find(u => u.email === email);
      if (exists) {
        res.status(400).json({ message: "User already exists (Mock)" });
        return;
      }
      
      const names = name.split(" ");
      mockDb.users.push({
        _id: `u${mockDb.users.length + 1}`,
        name,
        firstName: names[0],
        lastName: names.length > 1 ? names.slice(1).join(" ") : "",
        email,
        password: hashedPassword,
        role: role || "Employee",
        department: department || "General"
      });
      res.status(201).json({ message: "User registered successfully (Mock)" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = (rawEmail || "").trim().toLowerCase();

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    let user: any = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
    } else {
      user = mockDb.users.find(u => u.email === email);
    }

    if (!user) {
      console.log("[DB Login] Login failed for", email, !user ? "User not found" : "Password mismatch");
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("[DB Login] Login failed for", email, !user ? "User not found" : "Password mismatch");
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id || user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
