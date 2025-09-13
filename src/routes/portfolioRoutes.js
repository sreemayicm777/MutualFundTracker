import express from "express";
import { addFundToPortfolio,getPortfolioHistory,getPortfolioList, getPortfolioValue, removePortfolioFund } from "../controllers/portfolioController.js";
import { protect } from "../middleware/authMiddleware.js";
import { apiLimiter, portfolioLimiter } from "../middleware/rateLimiter.js";
import { portfolioValidation, removeFundValidation } from "../middleware/validator.js";
import { validationHandler } from "../middleware/validationHandler.js";

const router = express.Router();

router.post("/add", protect,portfolioLimiter,portfolioValidation,validationHandler, addFundToPortfolio);
router.get("/list", protect,apiLimiter, getPortfolioList);
router.get("/value", protect,apiLimiter, getPortfolioValue);
router.get("/history", protect,apiLimiter, getPortfolioHistory);
router.delete("/remove/:schemeCode", protect,portfolioLimiter,removeFundValidation,validationHandler, removePortfolioFund);


export default router;