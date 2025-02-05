import express from "express";
import * as questionController from "../controllers/question.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router
  .route("/create/:chapterId")
  .post(authMiddleware, questionController.createQustion);

router
  .route("/update/:questionId")
  .put(authMiddleware, questionController.updateQustion);

router
  .route("/delete/:questionId")
  .delete(authMiddleware, questionController.deleteQuestion);

router
  .route("/:chapterId")
  .get(authMiddleware, questionController.fetchQuestions);

export default router;
