import { Router } from "express";
import checkUser from "../middlewares/checkUser";

import { getMessageOfChannel } from "../controllers/message.controller";
import { updateChannel, deleteChannel } from "../controllers/channel.controller";

const router = Router();

router.get(
  "/servers/:serverId/:channelId/messages",
  checkUser,
  getMessageOfChannel
);

router.put("/channels/:id", checkUser, updateChannel);

router.delete("/channels/:id", checkUser, deleteChannel);

export default router;
