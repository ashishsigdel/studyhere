import express from "express";
import * as contactController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = express.Router();

router
  .route("/get-all")
  .get(authMiddleware, adminMiddleware, contactController.getAll);

export default router;
