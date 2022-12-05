import { Router, Response, Request, NextFunction } from "express";
import checkUser from "../middlewares/checkUser";
import db from "../db";
import { io } from "../index";

const router = Router();
router.get("/:id/messages", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await db.message.findMany({
      where: {
        serverId: req.params.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        user: true,
      },
    });
    res.json({ messages });
  } catch (error) {
    next(error);
  }
});
router.get("/:id/members", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await db.server.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        members: true,
        owner: true,
      },
    });
    res.json({ members });
  } catch (error) {
    next(error);
  }
});
router.post(
  "/:id",
  checkUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await db.message.create({
        data: {
          text: req.body.text,
          Server: {
            connect: {
              id: req.params.id,
            },
          },
          user: {
            connect: {
              id: res.locals.user.id,
            },
          },
        },
        include: {
          Server: {
            select: {
              members: true,
            },
          },
        },
      });
      message.Server.members.map((member: any) => {
        io.to(global.sockets[member.id]).emit("message", message);
      });
      res.json({ message });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
