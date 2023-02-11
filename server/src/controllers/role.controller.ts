import { Request, Response, NextFunction } from "express";
import db from "../db";
import ApiError from "../utils/ApiError";
import { io } from "../";

export const getSingleRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

export const getRoles = async (req: any, res: Response, next: NextFunction) => {
  try {
    const roles = await db.role.findMany({
      where: {
        Server: {
          id: req.params.id,
        },
      },
    });
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

export const createRole = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await db.role.create({
      data: {
        name: req.body.name,
        color: req.body.color,
        position: req.body.position,
        Permissions: {
          createMany: {
            data: req.body.permissions.map(
              (permission: { id: string; allowed: boolean }) => ({
                id: permission.id,
                allowed: permission.allowed,
              })
            ),
          },
        },
        Server: {
          connect: {
            id: req.params.id,
          },
        },
      },
    });
    res.json({ role, message: "Role created" });
  } catch (error) {
    next(error);
  }
};

export const addUserToRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await db.role.findUnique({
      where: {
        id: req.body.roleId,
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
    const isMember = await db.serverMember.findFirst({
      where: {
        serverId: role.serverId,
        userId: user.id,
      },
    });
    if (!isMember)
      throw new ApiError("User is not a member of this server", 403);
    await db.serverMember.update({
      where: {
        id: isMember.id,
      },
      data: {
        Roles: {
          connect: {
            id: role.id,
          },
        },
      },
    });
    io.to(role.serverId).emit("user added to role", {
      userId: user.id,
      roleId: role.id,
    });
    res.status(200).json({ message: "User added to role" });
  } catch (error) {
    next(error);
  }
};

export const removeUserFromRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await db.role.findUnique({
      where: {
        id: req.body.roleId,
      },
      include: {
        Users: {
          where: {
            userId: req.body.userId,
          },
        },
      },
    });

    if (!role) throw new ApiError("Role not found", 404);
    if (role.Users.length === 0)
      throw new ApiError("User is not a member of this role", 403);
    await db.serverMember.update({
      where: {
        id: role.Users[0].id,
      },
      data: {
        Roles: {
          disconnect: {
            id: role.id,
          },
        },
      },
    });
    io.to(role.serverId).emit("user removed from role", {
      userId: req.body.userId,
      roleId: role.id,
    });
    res.status(200).json({ message: "User removed from role" });
  } catch (error) {
    next(error);
  }
};
