import express from "express";
import * as answerController from "../controllers/answer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router
  .route("/add/:questionId")
  .post(authMiddleware, answerController.addAnswer);

router
  .route("/update/:questionId")
  .put(authMiddleware, answerController.updateAnswer);

router
  .route("/get/:questionId")
  .get(authMiddleware, answerController.getYourAnswersByQuestionId);

router
  .route("/get-all/:questionId")
  .get(authMiddleware, answerController.getAnswersByQuestionId);

export default router;
