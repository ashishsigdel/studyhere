import express from "express";
import * as contactController from "../controllers/contact.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

router
  .route("/reportbug")
  .post(
    authMiddleware,
    upload.single("screenshot"),
    contactController.reportbug
  );

export default router;
