import { Request, Response, NextFunction } from "express";
import apiError from "../utils/apiError.js";

export const globalError = (
  err: apiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({
    success: false,
    error: {
      status,
      statusCode,
      message,
      ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    },
  });
};
