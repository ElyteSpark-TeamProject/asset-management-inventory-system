import { Router } from "express";
import authRouter from "./auth";
import assetRouter from "./assets";
import assignmentRouter from "./assignments";
import employeeRouter from "./employees";
import reportRouter from "./reports";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Modular Routes - Team members work in their respective files
router.use("/auth", authRouter);
router.use("/assets", assetRouter);
router.use("/assignments", assignmentRouter);
router.use("/employees", employeeRouter);
router.use("/reports", reportRouter);

export default router;
