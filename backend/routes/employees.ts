import { Router } from "express";
import { getEmployees, getEmployeeById } from "../controllers/employeeController";

const router = Router();

// ==========================================
// MEMBER 4: EMPLOYEE MANAGEMENT
// ==========================================
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);

export default router;
