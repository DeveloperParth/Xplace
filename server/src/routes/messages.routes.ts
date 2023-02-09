import { Router } from "express";
import checkUser from "../middlewares/checkUser";
import * as messageController from "../controllers/message.controller";

import validate from "../middlewares/validate";
import { CreateMessageSchema } from "../utils/Schemas";

const router = Router();

router.post(
  "/messages",
  checkUser,
  validate(CreateMessageSchema),
  messageController.createMessage
);
router.put("/messages/:id", checkUser, messageController.updateMesasge);
router.delete("/messages/:id", checkUser, messageController.deleteMessage);

export default router;
