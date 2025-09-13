import express from "express";
import {  getFundNavHistory, getFunds, syncFundsToDB } from "../controllers/fundController.js";
import { protect } from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

// router.get("/all", getAllFundsFromAPI);
router.get("/",protect,apiLimiter, getFunds);
router.post("/sync",protect,apiLimiter, syncFundsToDB);
router.get("/:schemeCode/nav",protect,apiLimiter, getFundNavHistory);

export default router;
