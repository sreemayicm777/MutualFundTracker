// routes/navRoutes.js
import express from "express";
import { runNAVUpdateNow } from "../cronJobs/navUpdateJob.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Manual NAV update trigger (protected admin route)
router.post("/update-now", protect, async (req, res) => {
  try {
    const result = await runNAVUpdateNow();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;