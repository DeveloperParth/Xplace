import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import db from "../db";
async function checkUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) throw new ApiError("Unauthorized", 401);
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

    // const data = await db.user.findUnique({
    //   where: {
    //     id: decoded.id,
    //   },
    //   include: {
    //     joinedServers: {
    //       include: {
    //         Roles: {
    //           include: {
    //             Permissions: {
    //               include: {
    //                 Permission: true,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    res.locals.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}

export default checkUser;
