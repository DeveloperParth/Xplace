import { Router } from "express";
import * as roleController from "../controllers/role.controller";
import checkUser from "../middlewares/checkUser";

const router = Router();

router.post("/:id/user", checkUser, roleController.addUserToRole);

router.get("/:id", checkUser, roleController.getSingleRole);

export default router;
