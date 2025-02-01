import express from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/user").post(authController.authUser);

router.route("/refresh-token").post(authController.refreshAccessToken);

router.route("/logout").post(authMiddleware, authController.logoutUser);

export default router;
