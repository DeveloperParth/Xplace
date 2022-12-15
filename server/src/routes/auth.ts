import { NextFunction, Request, Response, Router } from "express";
import db from "../db";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
const router = Router();

router.post(
  "/login",
  async (
    req: Request & { body: { email: string; password: string } },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await db.user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!user) throw new ApiError("Email or password is wrong", 401);

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
      return res.json({ user, token });
    } catch (err) {
      next(err);
    }
  }
);
router.post(
  "/register",
  async (
    req: Request & {
      body: { email: string; password: string; name: string };
    },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await db.user.create({
        data: {
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
        },
      });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

      return res.json({ user, token });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
