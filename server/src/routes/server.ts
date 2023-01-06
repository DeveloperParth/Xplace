import { Response, Router, Request, NextFunction } from "express";
import db from "../db";
import checkUser from "../middlewares/checkUser";
import crypto from "crypto";
import ApiError from "../utils/ApiError";

const router = Router();

router.get(
  "/",
  checkUser,
  async (
    req,
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
              Role: {
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
  }
);
router.get(
  "/:id",
  checkUser,
  async (req: Request, res: Response, next: NextFunction) => {
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
              Role: true,
            },
          },
        },
      });
      if (!server) throw new ApiError("Server not found", 404);
      res.json({ server });
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
  }
);

// invite a user to a server
router.post(
  "/join/:code",
  checkUser,
  async (req: any, res: Response, next: NextFunction) => {
    // creates a new server
    try {
      const invitation = await db.invitation.findUnique({
        where: {
          code: req.params.code,
        },
        include: {
          Server: true,
        },
      });
      if (!invitation) throw new ApiError("Invitation not found", 404);
      if (invitation.expiresAt < new Date()) {
        await db.invitation.delete({
          where: {
            id: invitation.id,
          },
        });
        throw new ApiError("Invitation expired", 400);
      }
      const server = await db.server.update({
        where: {
          id: invitation.Server.id,
        },
        data: {
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
      res.json({ server, message: "Server joined" });
    } catch (error) {
      next(error);
    }
  }
);
router.get(
  "/join/:code",
  async (req: any, res: Response, next: NextFunction) => {
    // creates a new server
    try {
      // get the date of 7 days from now
      const invitation = await db.invitation.findUnique({
        where: {
          code: req.params.code,
        },
        include: {
          Server: true,
          User: true,
        },
      });
      res.json({ invitation });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/:id/invite",
  checkUser,
  async (req: any, res: Response, next: NextFunction) => {
    // creates a new server
    try {
      const getRandomCode = async () => {
        const code = crypto.randomBytes(4).toString("hex");
        const isExists = await db.invitation.findUnique({
          where: {
            code,
          },
        });
        if (isExists) {
          return getRandomCode();
        }
        return code;
      };
      // get the date of 7 days from now
      const isServerExists = await db.server.findUnique({
        where: { id: req.params.id },
      });
      if (!isServerExists) throw new ApiError("Server not found", 404);
      const expiresAt = new Date(req.body.expiresAt || Date.now() + 604800000);
      const invitation = await db.invitation.create({
        data: {
          Server: {
            connect: {
              id: req.params.id,
            },
          },
          code: await getRandomCode(),
          expiresAt,
          User: {
            connect: {
              id: res.locals.user.id,
            },
          },
        },
      });
      const link = `${process.env.FRONTEND_URL}/i/${invitation.code}`;
      res.json({ link, message: "Invitation created" });
    } catch (error) {
      next(error);
    }
  }
);

// Role
router.post(
  "/:id/role",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const role = await db.role.create({
        data: {
          name: req.body.name,
          color: req.body.color,
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
  }
);
router.get("/:id/Role", async (req: any, res: Response, next: NextFunction) => {
  try {
    const Role = await db.role.findMany({
      where: {
        Server: {
          id: req.params.id,
        },
      },
    });
    res.json({ Role });
  } catch (error) {
    next(error);
  }
});
// members
router.get(
  "/:id/members",
  async (req: Request, res: Response, next: NextFunction) => {
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
              Role: true,
            },
          },
          Owner: true,
        },
      });
      res.json({ members: members.Members });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/:id/category",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const category = await db.category.create({
        data: {
          name: req.body.name,
          Server: {
            connect: {
              id: req.params.id,
            },
          },
        },
      });
      res.json({ category, message: "Category created" });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/:serverId/channel",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, type, categoryId } = req.body;
      console.log(categoryId);

      const channel = await db.channel.create({
        data: {
          name: name,
          Server: {
            connect: {
              id: req.params.serverId,
            },
          },
          Category: {
            connect: {
              id: categoryId,
            },
          },
          type: type,
        },
      });
      res.json({ channel, message: "Channel created" });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
