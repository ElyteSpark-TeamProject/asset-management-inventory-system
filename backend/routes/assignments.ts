import { Router } from "express";
import { getAssignments, assignAsset, returnAsset } from "../controllers/assignmentController";

const router = Router();

// ==========================================
// MEMBER 3: ASSIGNMENTS & RETURNS
// ==========================================
router.get("/", getAssignments);
router.post("/assign", assignAsset);
router.post("/return/:id", returnAsset);

export default router;
