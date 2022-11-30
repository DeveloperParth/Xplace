import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import { config } from "dotenv";
import ApiError from "./utils/ApiError";
import db from "./db";
import { createServer } from "http";
import { Server } from "socket.io";

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
routes(app);

app.use((err: ApiError, _: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});

async function seedDb() {
  console.log("Seeding database...");
  await db.user.create({
    data: {
      email: "parth",
      password: "password",
      name: "Parth",
    },
  });
  console.log("Database seeded!");
}
global.sockets = {};
io.on("connection", (socket) => {
  socket.on("join", (data) => {
    global.sockets[data] = socket.id;
    console.log(global.sockets);
  });
  socket.on("disconnect", () => {
    // find the socket id and delete it
    for (let key in global.sockets) {
      if (global.sockets[key] === socket.id) {
        delete global.sockets[key];
      }
    }
  });
});

httpServer.listen(3000, () => {
  // seedDb();
  console.log("Server is running on port 3000");
});
