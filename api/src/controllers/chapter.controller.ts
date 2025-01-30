import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";

import Subject from "../models/subject";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import Chapter from "../models/chapter";

export const getAllChapters = asyncHandler(
  async (req: Request, res: Response) => {
    const { subjectId } = req.params;

    if (!subjectId) {
      throw new ApiError({
        status: 400,
        message: "Subject is missing!",
      });
    }

    const subject = await Subject.findOne({
      where: {
        id: subjectId,
      },
    });

    if (!subject) {
      throw new ApiError({
        status: 404,
        message: "Subject not found!",
      });
    }

    const allChapters = await Chapter.findAll({
      where: {
        subjectId: subjectId,
      },
    });

    return new ApiResponse({
      status: 200,
      message: "Chapters fetched successfully.",
      data: {
        subject: subject.name,
        chapters: allChapters,
      },
    }).send(res);
  }
);

export const createChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    if (!subjectId) {
      throw new ApiError({ status: 400, message: "Subject is not avaiable." });
    }
    const { name } = req.body;

    if (!name) {
      throw new ApiError({ status: 400, message: "Chapter name is required." });
    }

    const subject = await Subject.findOne({
      where: {
        id: subjectId,
      },
    });

    if (!subject) {
      throw new ApiError({ status: 404, message: "Subject is not avaiable." });
    }

    const nameExist = await Chapter.findOne({
      where: {
        name,
        subjectId,
      },
    });

    if (nameExist) {
      throw new ApiError({ status: 400, message: "Chapter already added." });
    }

    const chapter = await Chapter.create({
      name,
      subjectId,
    });

    return new ApiResponse({ message: "Chapter Created!", data: chapter }).send(
      res
    );
  }
);
