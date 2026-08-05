import { Router } from "express";
import { getStats, getReport } from "../controllers/reportController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// ==========================================
// MEMBER 5: DASHBOARD & REPORTS
// ==========================================
router.get("/stats", authenticate, getStats);
router.get("/export", authenticate, getReport);

export default router;
