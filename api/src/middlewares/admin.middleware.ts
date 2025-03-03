import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import RefreshToken from "../models/refreshToken";

interface CustomRequest extends Request {
  user?: InstanceType<typeof User>;
}

export const adminMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (user.role !== "admin") {
        return next(
          new ApiError({
            status: 401,
            message: "Unauthorized",
          })
        );
      }

      next();
    } catch (error) {
      return next(
        new ApiError({
          status: 401,
          message: "Unauthorized!",
        })
      );
    }
  }
);
