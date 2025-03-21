import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import asyncHandler from "../utils/asyncHandler";
import User from "../models/user";
import { Request, Response } from "express";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
dotenv.config();

const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface CustomRequest extends Request {
  user?: InstanceType<typeof User>;
}

export const getAnswerFromAi = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { question } = req.body;

    if (!question) {
      throw new ApiError({
        status: 400,
        message: "Question required!",
      });
    }

    const prompt = question;

    const result = await model.generateContent(prompt);

    const responseText = `<aipre>${result.response.text()}</aipre>`;

    return new ApiResponse({
      status: 200,
      message: responseText,
    }).send(res);
  }
);
