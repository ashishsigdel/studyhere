import express from "express";
import * as aiController from "../controllers/aiGenerate.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { rateLimit } from "express-rate-limit";
import ApiError from "../utils/apiError";

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  limit: 1,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new ApiError({
        status: 429,
        message: "Please wait 3 minutes to generate next answer.",
      })
    );
  },
});

const router = express.Router();

router
  .route("/generate/:questionId")
  .get(authMiddleware, limiter, aiController.getAnswerFromAi);

export default router;
