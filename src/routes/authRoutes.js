import express from "express";
import { signup, login } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { loginValidation, signupValidation } from "../middleware/validator.js";
import { validationHandler } from "../middleware/validationHandler.js";

const router = express.Router();

router.post("/signup", signupValidation, validationHandler, signup);
router.post("/login", loginLimiter, loginValidation, validationHandler, login);

export default router;
