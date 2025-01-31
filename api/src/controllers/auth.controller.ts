import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import User from "../models/user";
import { generateTokens } from "../utils/generateTokens";
import ApiResponse from "../utils/apiResponse";

export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, profilePic } = req.body;

  if (!fullName) {
    throw new ApiError({
      status: 400,
      message: "FullName is required!",
    });
  }

  if (!email) {
    throw new ApiError({
      status: 400,
      message: "Email is required!",
    });
  }

  let user = await User.findOne({ where: { email } });

  if (!user) {
    user = await User.create({ fullName, email, profilePic });
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
  });

  const { password, ...userWithoutPassword } = user.toJSON();

  return new ApiResponse({
    status: 200,
    message: "User Logged in.",
    data: { user: userWithoutPassword },
  }).send(res);
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return new ApiResponse({
    status: 200,
    message: "Logged out successfully",
  }).send(res);
});
