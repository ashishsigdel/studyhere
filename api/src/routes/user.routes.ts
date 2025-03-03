import express from "express";
import * as contactController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { apiKeyMiddleware } from "../middlewares/api.middleware";

const router = express.Router();

router.route("/get-all").get(apiKeyMiddleware, contactController.getAll);

export default router;
