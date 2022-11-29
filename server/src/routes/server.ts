import { Response, Router, Request, NextFunction } from "express";
import db from "../db";
import checkUser from "../middlewares/checkUser";

const router = Router();

router.get(
  "/",
  async (
    req,
    res: Response & { locals: { user: { id: string } } },
    next: NextFunction
  ) => {
    // finds all servers the user is a part of
    try {
      const servers = await db.server.findMany({
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
        },
      });
      res.json({ server, message: "Server created" });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
