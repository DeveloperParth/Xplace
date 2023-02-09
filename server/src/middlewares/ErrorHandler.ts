import { NextFunction, Response } from "express";
import ApiError from "src/utils/ApiError";
import { z } from "zod";

const ErrorHandler = (
  err: ApiError,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof z.ZodError) {
    console.log(err.issues[0])
    return res.status(400).json({
      message: err.issues[0].message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
  }
  return res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

export default ErrorHandler;
