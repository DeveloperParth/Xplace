import { Router } from "express";
import checkUser from "../middlewares/checkUser";
import * as messageController from "../controllers/message.controller";

const router = Router();
router.post(
  "/:serverId/:channelId",
  checkUser,
  messageController.createMessage
);
router.put("/:id", checkUser, messageController.updateMesasge);
router.delete("/:id", checkUser, messageController.deleteMessage);

export default router;
