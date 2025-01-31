import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/generateTokens";
import User from "../models/user";

declare module "express" {
  export interface Request {
    user?: User;
  }
}

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let accessToken = req.cookies?.accessToken;

      if (!accessToken) {
        return next(
          new ApiError({
            status: 401,
            message: "Missing access token",
          })
        );
      }

      try {
        const decodedToken: any = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as jwt.Secret
        );

        const user = await User.findOne({
          where: {
            id: decodedToken.userId,
          },
        });

        if (!user) {
          throw new ApiError({
            status: 401,
            message: "User not found!",
          });
        }

        req.user = user;
        return next();
      } catch (accessError: any) {
        if (
          accessError.name === "TokenExpiredError" ||
          accessError.name === "JsonWebTokenError"
        ) {
          let refreshToken = req.cookies?.refreshToken;

          if (!refreshToken) {
            return next(
              new ApiError({
                status: 401,
                message: "Missing refresh token",
              })
            );
          }
          try {
            const decoded: any = jwt.verify(
              refreshToken,
              process.env.ACCESS_TOKEN_SECRET as jwt.Secret
            );

            const { accessToken: newAccessToken } = generateTokens(
              decoded.userId
            );

            res.cookie("accessToken", newAccessToken, {
              httpOnly: true,
              secure: true,
              sameSite: "none" as const,
              maxAge: 30 * 60 * 60 * 24 * 1000,
            });

            const user = await User.findOne({
              where: {
                id: decoded.userId,
              },
            });

            if (!user) {
              throw new ApiError({
                status: 401,
                message: "User not found!",
              });
            }

            req.user = user;
            return next();
          } catch (refreshError: any) {
            if (refreshError.name === "TokenExpiredError") {
              return next(
                new ApiError({
                  status: 401,
                  message: "Session expired, please login again",
                })
              );
            }
            return next(
              new ApiError({
                status: 401,
                message: "Invalid refresh token",
              })
            );
          }
        }
      }
    } catch (error) {
      return next(
        new ApiError({
          status: 500,
          message: "Internal server error",
        })
      );
    }
  }
);
