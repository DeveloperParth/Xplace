import { NextFunction, Request, Response, Router } from "express";
import db from "../db";
import ApiError from "../utils/ApiError";

const router = Router();

router.post(
  "/:id/user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = await db.role.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          Users: true,
        },
      });
      if (!role) throw new ApiError("Role not found", 404);
      const user = await db.user.findUnique({
        where: {
          id: req.body.userId,
        },
      });
      if (!user) throw new ApiError("User not found", 404);
      await db.role.update({
        where: {
          id: req.params.id,
        },
        data: {
          Users: {
            connect: {
              id: req.body.userId,
            },
          },
        },
      });
      res.status(200).json({ message: "User added to role" });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await db.role.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        Users: true,
      },
    });
    if (!role) throw new ApiError("Role not found", 404);
    res.json({ role });
  } catch (error) {
    next(error);
  }
});

export default router;
