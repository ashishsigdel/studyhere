import { Request, Response } from "express";
import User from "../models/user";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

export const getAll = asyncHandler(async (req: any, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const { count, rows: users } = await User.findAndCountAll({
    order: [["id", "DESC"]],
    attributes: ["id", "fullName", "email", "role", "validEmail"],
    limit,
    offset,
  });

  return new ApiResponse({
    status: 201,
    message: "Users fetched successfully",
    data: {
      users,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    },
  }).send(res);
});
