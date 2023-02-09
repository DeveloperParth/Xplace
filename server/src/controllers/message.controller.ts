import { Request, Response, NextFunction } from "express";
import db from "../db";
import ApiError from "../utils/ApiError";
import { io } from "../index";
export const getMessageOfChannel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messages = await db.message.findMany({
      where: {
        AND: {
          serverId: req.params.serverId,
          channelId: req.params.channelId,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        ReplyTo: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });
    res.json({ messages });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { text, replyTo, channelId, serverId } = req.body;
    const message = await db.message.create({
      data: {
        text: text,
        Channel: {
          connect: {
            id: channelId,
          },
        },
        Server: {
          connect: {
            id: serverId,
          },
        },
        user: {
          connect: {
            id: res.locals.user.id,
          },
        },
        ReplyTo: replyTo
          ? {
              connect: {
                id: replyTo,
              },
            }
          : undefined,
      },
      include: {
        ReplyTo: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });
    io.to(serverId).emit("message", message);
    res.json({ message });
  } catch (error) {
    next(error);
  }
};

export const updateMesasge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await db.message.update({
      where: {
        id: req.params.id,
      },
      data: {
        text: req.body.text,
        isEdited: true,
      },
      include: {
        Server: true,
      },
    });
    io.to(message.Server.id).emit("message update", {
      message: message,
    });
    return res.json({ message });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await db.message.findUnique({
      where: { id: req.params.id },
    });
    if (!message) throw new ApiError("Message not found", 404);

    io.to(message.serverId).emit("message delete", {
      message: message,
    });
    await db.message.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Deleted succesfully" });
  } catch (error) {
    next(error);
  }
};
