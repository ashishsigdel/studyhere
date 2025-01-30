import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";

import Subject from "../models/subject";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";

export const getAllSubjects = asyncHandler(
  async (req: Request, res: Response) => {
    const allSubject = await Subject.findAll();

    return new ApiResponse({
      status: 200,
      message: "All Subject fetched.",
      data: allSubject,
    }).send(res);
  }
);

export const createSubject = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
      throw new ApiError({
        status: 400,
        message: "Subject is required.",
      });
    }

    const nameExist = await Subject.findOne({
      where: {
        name,
      },
    });

    if (nameExist) {
      throw new ApiError({
        status: 400,
        message: "Subject already exists.",
      });
    }

    const subject = await Subject.create({
      name,
    });

    return new ApiResponse({
      status: 200,
      message: "All Subject fetched.",
      data: subject,
    }).send(res);
  }
);
