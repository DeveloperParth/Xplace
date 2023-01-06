import { NextFunction, Response } from "express";
import ApiError from "src/utils/ApiError";


const ErrorHandler = (
  err: ApiError,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  return res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

export default ErrorHandler;