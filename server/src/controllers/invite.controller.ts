import { Response, NextFunction } from "express";
import db from "../db";
import crypto from "crypto";
import ApiError from "../utils/ApiError";

export const joinServerWihtCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
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
};

export const getInviteWithCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
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
};

export const createInvite = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
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
};
