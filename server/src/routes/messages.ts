import { Router, Response, Request, NextFunction } from "express";
import db from "../db";

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

export default router;
