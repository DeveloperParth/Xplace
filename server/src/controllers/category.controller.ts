import { Response, NextFunction } from "express";
import db from "../db";


export const createCategory = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await db.category.create({
      data: {
        name: req.body.name,
        Server: {
          connect: {
            id: req.params.id,
          },
        },
      },
    });
    res.json({ category, message: "Category created" });
  } catch (error) {
    next(error);
  }
};
