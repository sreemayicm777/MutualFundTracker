import rateLimit from "express-rate-limit";

//login
export const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
     message: { success: false, message: "Too many login attempts, try again later" },
});


//API limter

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100, 
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: { success: false, message: "Too many requests, try again later" },
});


//  Portfolio updates limiter

export const portfolioLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, 
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: { success: false, message: "Too many portfolio updates, try again later" },
});