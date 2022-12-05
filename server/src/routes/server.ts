import { Response, Router, Request, NextFunction } from "express";
import db from "../db";
import checkUser from "../middlewares/checkUser";

const router = Router();

router.get(
  "/",
  checkUser,
  async (
    req,
    res: Response & { locals: { user: { id: string } } },
    next: NextFunction
  ) => {
    // finds all servers the user is a part of
    try {
      const servers = await db.server.findMany({
        where: {
          members: {
            some: {
              id: res.locals.user.id,
            },
          },
        },
        include: {
          owner: true,
        },
      });
      res.json({ servers });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/",
  checkUser,
  async (req: any, res: Response, next: NextFunction) => {
    // creates a new server
    try {
      const server = await db.server.create({
        data: {
          name: req.body.name,
          ownerId: res.locals.user.id,
          members: {
            connect: {
              id: res.locals.user.id,
            },
          },
        },
      });
      res.json({ server, message: "Server created" });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id/messages",
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);
router.get(
  "/:id/members",
  async (req: Request, res: Response, next: NextFunction) => {
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
      res.json({ members: members.members });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
