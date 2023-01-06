import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import { config } from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import morgan from "morgan";
import routes from "./routes";
import ApiError from "./utils/ApiError";
import prisma from "./db";
import socketMiddleware from "./middlewares/socket";
import ErrorHandler from "./middlewares/ErrorHandler";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
config();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use(morgan("dev"));

routes(app);
app.use(ErrorHandler as any);

io.use(socketMiddleware);

global.sockets = {};
io.on(
  "connection",
  (
    socket: Socket & { userId: string; preferedStatus: "Idle" | "DND" | null }
  ) => {
    socket.on("join", async ({ status }) => {
      global.sockets[socket.userId] = socket.id;
      socket.preferedStatus = status;
      await prisma.user
        .update({
          where: {
            id: socket.userId,
          },
          data: {
            status: status || "Online",
          },
        })
        .catch((err) => {
          if (err.code === "P2025") {
            socket.disconnect(true);
          }
        });
      await prisma.user
        .findUnique({
          where: {
            id: socket.userId,
          },
          include: {
            joinedServers: true,
          },
        })
        .then((user) => {
          if (user) {
            user.joinedServers.forEach((server) => {
              socket.join(server.serverId);
            });
          }
        });
    });
    socket.on("status", async ({ status }) => {
      socket.preferedStatus = status;
      await prisma.user.update({
        where: {
          id: socket.userId,
        },
        data: {
          status: status || "Online",
        },
      });
      await prisma.user
        .findUnique({
          where: {
            id: socket.userId,
          },
          include: {
            joinedServers: true,
          },
        })
        .then((user) => {
          if (user) {
            user.joinedServers.forEach((server) => {
              socket.to(server.serverId).emit("status");
            });
          }
        });
    });
    // socket.on("members", (data) => {
    //   socket.broadcast.emit("members", data);
    // });
    // socket.on("message", (server, message) => {
    //   socket.broadcast.to(server).emit("message", message);
    // });
    socket.on("disconnect", async () => {
      // find the socket id and delete it
      await prisma.user.update({
        where: {
          id: socket.userId,
        },
        data: {
          status: socket.preferedStatus || "Offline",
        },
      });
      delete global.sockets[socket.userId];
    });
  }
);

httpServer.listen(3000, () => {
  // seedDb();
  console.log("Server is running on port 3000");
});
