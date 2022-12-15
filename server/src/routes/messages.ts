import { Router, Response, Request, NextFunction } from "express";
import checkUser from "../middlewares/checkUser";
import db from "../db";
import { io } from "../index";

const router = Router();
// router.get(
//   "/:id/messages",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const messages = await db.message.findMany({
//         where: {
//           serverId: req.params.id,
//         },
//         orderBy: {
//           createdAt: "asc",
//         },
//         include: {
//           ReplyTo: {
//             include: {
//               user: true,
//             },
//           },
//           user: true,
//         },
//       });
//       res.json({ messages });
//     } catch (error) {
//       next(error);
//     }
//   }
// );
router.get(
  "/:id/members",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const members = await db.server.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          Members: true,
          Owner: true,
        },
      });
      res.json({ members });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/:id",
  checkUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await db.message.create({
        data: {
          text: req.body.text,
          ReplyTo: req.body.replyTo && {
            connect: {
              id: req.body.replyTo,
            },
          },
          Server: {
            connect: {
              id: req.params.id,
            },
          },
          user: {
            connect: {
              id: res.locals.user.id,
            },
          },
        },
        include: {
          Server: true,
        },
      });
      io.to(req.params.id).emit("message", message);
      res.json({ message });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  checkUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await db.message.update({
        where: {
          id: req.params.id,
        },
        data: {
          text: req.body.text,
          isEdited: true,
        },
        include: {
          Server: true,
        },
      });
      res.json({ message });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
