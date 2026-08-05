import { Router } from "express";
import { getAssignments, assignAsset, returnAsset } from "../controllers/assignmentController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// ==========================================
// MEMBER 3: ASSIGNMENTS & RETURNS
// ==========================================
router.get("/", authenticate, getAssignments);
router.post("/assign", authenticate, requireAdmin, assignAsset);
router.post("/return/:id", authenticate, requireAdmin, returnAsset);

export default router;
