import express from "express";
import * as aiController from "../controllers/aiGenerate.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/generate/:questionId").get(aiController.getAnswerFromAi);

export default router;
