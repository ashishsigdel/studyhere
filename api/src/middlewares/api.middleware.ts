import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import dotenv from "dotenv";

dotenv.config();

interface CustomRequest extends Request {
  user?: InstanceType<typeof User>;
}

export const apiKeyMiddleware = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const apiKey = req.headers["x-api-key"];

      if (!apiKey) {
        throw new ApiError({
          status: 401,
          message: "API key is missing!",
        });
      }

      // If API key is stored in an environment variable
      if (apiKey !== process.env.API_KEY) {
        throw new ApiError({
          status: 403,
          message: "Invalid API key!",
        });
      }

      next();
    } catch (error) {
      return next(error);
    }
  }
);
