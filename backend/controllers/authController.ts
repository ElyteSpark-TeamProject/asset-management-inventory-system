import { Request, Response } from "express";

// ==========================================
// MEMBER 1: AUTHENTICATION CONTROLLER
// Task: Implement JWT logic and verify passwords.
// Safeguard: Returns mock token for now.
// ==========================================

export const login = async (req: Request, res: Response) => {
  // TODO: Connect to MongoDB User model
  res.json({ token: "mock-jwt-token-123", user: { id: 1, name: "Admin", role: "admin" } });
};

export const register = async (req: Request, res: Response) => {
  res.json({ message: "User registered successfully (Mock)" });
};
