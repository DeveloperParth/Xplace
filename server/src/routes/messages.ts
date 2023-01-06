import { Router, Response, Request, NextFunction } from "express";
import checkUser from "../middlewares/checkUser";
import db from "../db";
import { io } from "../index";
import ApiError from "../utils/ApiError";

const router = Router();
router.post(
  "/:serverId/:channelId",
  checkUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { channelId, serverId } = req.params;
      const { text, replyTo } = req.body;
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
  }
);
router.put(
  "/:id",
  checkUser,
  async (req: Request, res: Response, next: NextFunction) => {
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
      res.json({ message });
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/:id",
  checkUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await db.message.findUnique({
        where: { id: req.params.id },
      });
      if (!message) throw new ApiError("Message not found", 404);

      await db.message.delete({
        where: { id: req.params.id },
      });
      res.json({ message: "Deleted succesfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
