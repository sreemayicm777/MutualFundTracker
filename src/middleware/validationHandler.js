import { validationResult } from "express-validator";

export const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Transform errors into clean format
    const formattedErrors = errors.array().map(err => ({
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  }
  next();
};
