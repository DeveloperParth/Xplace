import { Router, Request, Response, NextFunction } from "express";
import db from "../db";
import checkUser from "../middlewares/checkUser";

const router = Router();

router.get(
  "/servers/:serverId/:channelId/messages",
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

router.put(
  "/channels/:id",
  checkUser,
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export default router;
