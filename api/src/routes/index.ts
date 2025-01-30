import express from "express";

import subjectRoute from "./subject.routes";
import chapterRoute from "./chapter.routes";
import questionRoute from "./question.routes";

const router = express.Router();

router.use("/subject", subjectRoute);
router.use("/chapter", chapterRoute);
router.use("/question", questionRoute);

export default router;
