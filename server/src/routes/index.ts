import { Application } from "express";

import auth from "./auth.routes";
import message from "./messages.routes";
import users from "./users.routes";
import servers from "./server.routes";
import roles from "./roles.routes";
import channels from "./channels.routes";

export default function routes(app: Application): void {
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/messages", message);
  app.use("/api", channels);
  app.use("/api/servers", servers);
  app.use("/api/roles", roles);
}
