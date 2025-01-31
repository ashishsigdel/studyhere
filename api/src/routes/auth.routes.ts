import express from "express";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.route("/user").post(authController.authUser);

export default router;
