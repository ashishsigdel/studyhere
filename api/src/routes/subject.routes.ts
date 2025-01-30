import express from "express";
import * as subjectContrller from "../controllers/subject.controller";

const router = express.Router();

router.route("/").get(subjectContrller.getAllSubjects);

router.route("/create").post(subjectContrller.createSubject);

export default router;
