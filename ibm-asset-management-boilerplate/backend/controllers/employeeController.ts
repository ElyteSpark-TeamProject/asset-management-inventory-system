import { Request, Response } from "express";

// ==========================================
// MEMBER 4: EMPLOYEE CONTROLLER
// Task: List employees, view their specific assignments.
// ==========================================

export const getEmployees = async (req: Request, res: Response) => {
  // Mock data
  res.json([
    { id: 1, name: "John Doe", department: "Engineering", role: "Employee" },
    { id: 2, name: "Jane Smith", department: "Design", role: "Employee" }
  ]);
};

export const getEmployeeById = async (req: Request, res: Response) => {
  res.json({ id: req.params.id, name: "John Doe", department: "Engineering" });
};
