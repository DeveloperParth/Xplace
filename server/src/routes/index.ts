import { Application } from "express";

import auth from "./auth";
import message from "./messages";
import users from "./users";
import servers from "./server";

export default function routes(app: Application): void {
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/messages", message);
  app.use("/api/servers", servers);
}
