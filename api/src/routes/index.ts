import express from "express";

import subjectRoute from "./subject.routes";

const router = express.Router();

router.use("/subject", subjectRoute);

export default router;
