import { Request, Response, NextFunction } from "express";
import db from "../db";
export const updateChannel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const channel = await db.channel.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    res.json({ channel });
  } catch (error) {
    next(error);
  }
};

export const createChannel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, categoryId } = req.body;
    console.log(categoryId);

    const channel = await db.channel.create({
      data: {
        name: name,
        Server: {
          connect: {
            id: req.params.serverId,
          },
        },
        Category: {
          connect: {
            id: categoryId,
          },
        },
        type: type,
      },
    });
    res.json({ channel, message: "Channel created" });
  } catch (error) {
    next(error);
  }
};
