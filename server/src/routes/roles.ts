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
      const isMember = await db.serverMember.findUnique({
        where: {
          serverId_userId: {
            serverId: role.serverId,
            userId: user.id,
          },
        },
      });
      if (!isMember)
        throw new ApiError("User is not a member of this server", 403);
      await db.serverMember.update({
        where: {
          serverId_userId: {
            serverId: role.serverId,
            userId: user.id,
          },
        },
        data: {
          Role: {
            connect: {
              id: role.id,
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
