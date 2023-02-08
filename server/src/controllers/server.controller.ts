import { Response, Request, NextFunction } from "express";
import db from "../db";
import ApiError from "../utils/ApiError";

export const getServers = async (
  _: Request,
  res: Response & { locals: { user: { id: string } } },
  next: NextFunction
) => {
  // finds all servers the user is a part of
  try {
    const servers = await db.server.findMany({
      where: {
        Members: {
          some: {
            userId: res.locals.user.id,
          },
        },
      },
      include: {
        Owner: true,
        Categories: {
          include: {
            Channels: true,
          },
        },
        Channels: true,
        Members: {
          where: {
            userId: res.locals.user.id,
          },
          include: {
            Roles: {
              include: {
                Permissions: {
                  include: {
                    Permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    res.json({ servers });
  } catch (error) {
    next(error);
  }
};

export const getSingleServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // finds a server by id
  try {
    const server = await db.server.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        Owner: true,
        Members: {
          include: {
            Roles: true,
          },
        },
      },
    });
    if (!server) throw new ApiError("Server not found", 404);
    res.json({ server });
  } catch (error) {
    next(error);
  }
};

export const createServer = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // creates a new server
  try {
    const server = await db.server.create({
      data: {
        name: req.body.name,
        ownerId: res.locals.user.id,
        Members: {
          create: {
            User: {
              connect: {
                id: res.locals.user.id,
              },
            },
          },
        },
      },
    });
    await db.category.create({
      data: {
        name: "General",
        Channels: {
          create: {
            name: "general",
            type: "text",
            Server: {
              connect: {
                id: server.id,
              },
            },
          },
        },
        Server: {
          connect: {
            id: server.id,
          },
        },
      },
    });
    res.json({ server, message: "Server created" });
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const members = await db.server.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        Members: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
            Roles: true,
          },
        },
        Owner: true,
      },
    });
    res.json({ members: members.Members });
  } catch (error) {
    next(error);
  }
};
