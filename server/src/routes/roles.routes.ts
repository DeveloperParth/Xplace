import { Router } from "express";
import * as roleController from "../controllers/role.controller";
import checkUser from "../middlewares/checkUser";

const router = Router();

router.patch("/add-user", checkUser, roleController.addUserToRole);

router.get("/:id", checkUser, roleController.getSingleRole);

router.patch("/remove-user", checkUser, roleController.removeUserFromRole);
export default router;
