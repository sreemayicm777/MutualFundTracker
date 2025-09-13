// routes/navRoutes.js
import express from "express";
import { runNAVUpdateNow } from "../services/navUpdateJob.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/test-update-nav", protect, async (req, res) => {
  try {
    await runNAVUpdateNow();
    res.json({ success: true, message: "Manual NAV update triggered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
