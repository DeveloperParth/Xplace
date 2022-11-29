import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
function checkUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(req.headers.authorization);
    
    if (!token) throw new ApiError("Unauthorized", 401);
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default checkUser;
