import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";

import Subject from "../models/subject";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import { getAuthToken, getCookieToken, verifyToken } from "../utils/jwtUtils";
import User from "../models/user";

export const getAllSubjects = asyncHandler(
  async (req: Request, res: Response) => {
    const accessToken = getCookieToken(req) || getAuthToken(req);

    let whereCondition: {
      isPublic?: boolean;
    } = {
      isPublic: true,
    };

    if (accessToken) {
      try {
        const decodedToken = verifyToken({
          token: accessToken,
        });

        const user = await User.findOne({
          where: {
            id: decodedToken.id,
          },
        });

        if (user && user.role === "admin") {
          whereCondition = {};
        }
      } catch (error) {}
    }

    const allSubject = await Subject.findAll({ where: whereCondition });

    return new ApiResponse({
      status: 200,
      message: "All Subjects fetched.",
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
