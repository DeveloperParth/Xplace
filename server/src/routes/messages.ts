import { Router, Response, Request, NextFunction } from "express";
import checkUser from "../middlewares/checkUser";
import db from "../db";
import { io } from "src";

const router = Router();
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await db.message.findMany({
      where: {
        serverId: req.params.id,
      },
    });
    res.json({ messages });
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
      });
      io.to(global.sockts[res.locals.user.id]).emit("message", message);
      res.json({ message });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
