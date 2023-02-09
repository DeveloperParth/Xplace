import { Request, Response, NextFunction } from "express";
import db from "../db";
import { io } from "../index";
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
    console.log(name, "name");

    const channel = await db.channel.create({
      data: {
        name,
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
    io.to(req.params.serverId).emit("channel create", { channel });
    res.json({ channel, message: "Channel created" });
  } catch (error) {
    next(error);
  }
};

export const deleteChannel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const channel = await db.channel.delete({
      where: {
        id,
      },
    });
    await db.message.deleteMany({
      where: {
        channelId: id,
      },
    });
    io.to(channel.serverId).emit("channel delete", { channel });
    res.json({ channel, message: "Channel deleted" });
  } catch (error) {
    next(error);
  }
};
