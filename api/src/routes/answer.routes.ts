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
  .route("/update-admin/:answerId")
  .put(authMiddleware, answerController.updateAnswerAdmin);

router
  .route("/get/:questionId")
  .get(authMiddleware, answerController.getYourAnswersByQuestionId);

router
  .route("/get-all/:questionId")
  .get(authMiddleware, answerController.getAnswersByQuestionId);

router
  .route("/like/:answerId")
  .put(authMiddleware, answerController.toggleLike);

export default router;
