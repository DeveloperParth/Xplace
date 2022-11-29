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
    next: (err: ApiError) => void
  ) => {
    try {
      const user = await db.user.findUnique({
        where: {
          email: req.body.email,
        },
      });
      console.log(user);
      
      if (!user) throw new ApiError("User not found", 401);

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
    res: Response
  ) => {
    const user = await db.user.create({
      data: {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
      },
    });
    return res.json(user);
  }
);
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await db.user.findMany();
    return res.json({ users });
  } catch (error) {
    next(error);
  }
});

export default router;
