import { Router } from "express";
import { getStats, getReport } from "../controllers/reportController";

const router = Router();

// ==========================================
// MEMBER 5: DASHBOARD & REPORTS
// ==========================================
router.get("/stats", getStats);
router.get("/export", getReport);

export default router;
