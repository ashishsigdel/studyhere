import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";

export const addAnswer = asyncHandler(async (req: Request, res: Response) => {
  const questionId = req.params;

  const { answer, userId } = req.body;
});
