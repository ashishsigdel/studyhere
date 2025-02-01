import asyncHandler from "../utils/asyncHandler";
import { getAuthToken, getCookieToken, verifyToken } from "../utils/jwtUtils";
import ApiError from "../utils/apiError";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import RefreshToken from "../models/refreshToken";

interface CustomRequest extends Request {
  user?: InstanceType<typeof User>;
}

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = getCookieToken(req) || getAuthToken(req);

      if (!accessToken) {
        return next(
          new ApiError({
            status: 401,
            message: "Missing token",
          })
        );
      }

      const decodedToken = verifyToken({
        token: accessToken,
      });

      const refreshToken = await RefreshToken.findOne({
        where: {
          id: decodedToken.rfId,
          userId: decodedToken.id,
        },
      });

      if (!refreshToken) {
        return next(
          new ApiError({
            status: 401,
            message: "Invalid token",
          })
        );
      }

      // Verify refresh token
      verifyToken({
        token: refreshToken.token,
      });

      if (refreshToken.expiresAt.getTime() < Date.now()) {
        return next(
          new ApiError({
            status: 401,
            message: "Token expired",
          })
        );
      }

      // Check if user exists
      const user = await User.findOne({
        where: {
          id: decodedToken.id,
        },
      });

      if (!user) {
        return next(
          new ApiError({
            status: 401,
            message: "User not found",
          })
        );
      }

      (req as CustomRequest).user = user;
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
