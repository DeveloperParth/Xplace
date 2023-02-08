import { Router } from "express";
import checkUser from "../middlewares/checkUser";

import * as serverController from "../controllers/server.controller";
import * as inviteController from "../controllers/invite.controller";
import * as roleController from "../controllers/role.controller";

import * as channelController from "../controllers/channel.controller";
import { createCategory } from "../controllers/category.controller";

const router = Router();

router.get("/", checkUser, serverController.getServers);
router.get("/:id", checkUser, serverController.getSingleServer);
router.post("/", checkUser, serverController.createServer);

// invite a user to a server
router.post("/join/:code", checkUser, inviteController.joinServerWihtCode);
router.get("/join/:code",checkUser, inviteController.getInviteWithCode);
router.post("/:id/invite", checkUser, inviteController.createInvite);

// Role
router.post("/:id/role", checkUser, roleController.createRole);
router.get("/:id/Role", checkUser, roleController.getRoles);
// members
router.get("/:id/members", checkUser, serverController.getMembers);

router.post("/:id/category", checkUser, createCategory);
router.post("/:serverId/channel", checkUser, channelController.createChannel);
export default router;
