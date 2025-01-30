import express from "express";
import * as chapterController from "../controllers/chapter.controller";

const router = express.Router();

router.route("/create/:subjectId").post(chapterController.createChapter);

router.route("/:subjectId").get(chapterController.getAllChapters);

export default router;
