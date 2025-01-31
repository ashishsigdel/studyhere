import express from "express";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.route("/user").post(authController.authUser);

router.route("/logout").post(authController.logoutUser);

export default router;
