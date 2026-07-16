import { Router } from "express";
import { getAssets, createAsset, updateAsset, deleteAsset } from "../controllers/assetController";

const router = Router();

// ==========================================
// MEMBER 2 & 6: ASSET CRUD & SEARCH
// ==========================================
router.get("/", getAssets);
router.post("/", createAsset);
router.put("/:id", updateAsset);
router.delete("/:id", deleteAsset);

export default router;
