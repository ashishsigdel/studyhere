import express from "express";
import * as aiController from "../controllers/aiGenerate.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/generate").post(aiController.getAnswerFromAi);

export default router;
