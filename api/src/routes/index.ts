import express from "express";

import subjectRoute from "./subject.routes";
import chapterRoute from "./chapter.routes";
import questionRoute from "./question.routes";
import authRoute from "./auth.routes";
import answerRoute from "./answer.routes";
import contactRoute from "./contact.routes";
import userRoute from "./user.routes";
import aiRoute from "./ai.routes";

const router = express.Router();

router.use("/subject", subjectRoute);
router.use("/chapter", chapterRoute);
router.use("/question", questionRoute);
router.use("/auth", authRoute);
router.use("/answer", answerRoute);
router.use("/contact", contactRoute);
router.use("/user", userRoute);
router.use("/ai", aiRoute);

export default router;
