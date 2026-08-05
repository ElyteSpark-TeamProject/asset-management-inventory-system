import { Router } from "express";
import { getAssets, createAsset, updateAsset, deleteAsset } from "../controllers/assetController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// ==========================================
// MEMBER 2 & 6: ASSET CRUD & SEARCH
// ==========================================
router.get("/", authenticate, getAssets);
router.post("/", authenticate, requireAdmin, createAsset);
router.put("/:id", authenticate, requireAdmin, updateAsset);
router.delete("/:id", authenticate, requireAdmin, deleteAsset);

export default router;
