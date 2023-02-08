import { NextFunction, Request, Response, Router } from "express";
import db from "../db";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await db.user.findMany();
    return res.json({ users });
  } catch (error) {
    next(error);
  }
});

export default router;
