import { body, param, query } from "express-validator";
import validator from "validator";

//sign 
export const signupValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .escape(),
  body("email")
    .normalizeEmail()
    .custom((value) => {
      if (!validator.isEmail(value)) throw new Error("Invalid email format");
      return true;
    }),
  body("password")
    .custom((value) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(value)) {
        throw new Error(
          "Password must be at least 8 chars, include uppercase, lowercase, number, and special character"
        );
      }
      return true;
    }),
];


//login

export const loginValidation = [
  body("email")
    .normalizeEmail()
    .custom((value) => {
      if (!validator.isEmail(value)) throw new Error("Invalid email format");
      return true;
    }),
  body("password").notEmpty().withMessage("Password is required"),
];

// Add fund to portfolio
export const portfolioValidation = [
  body("schemeCode")
    .isInt({ min: 1 })
    .withMessage("Invalid scheme code"),
  body("units")
    .isFloat({ gt: 0 })
    .withMessage("Units must be a positive number"),
];

// Remove fund from portfolio
export const removeFundValidation = [
  param("schemeCode")
    .isInt({ min: 1 })
    .withMessage("Invalid scheme code"),
];