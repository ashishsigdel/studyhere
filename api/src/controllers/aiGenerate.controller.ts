import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import asyncHandler from "../utils/asyncHandler";
import User from "../models/user";
import { Request, Response } from "express";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import Question from "../models/question";
dotenv.config();
import { convert } from "html-to-text";
import Answer from "../models/answer";
import { convertMarkdownToHtml } from "../utils/convertStructuredContent";

const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

interface CustomRequest extends Request {
  user?: InstanceType<typeof User>;
}

export const getAnswerFromAi = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { questionId } = req.params;

    if (!questionId) {
      throw new ApiError({
        status: 400,
        message: "Cannot add answer!",
      });
    }

    const existQuestion = await Question.findByPk(questionId);

    if (!existQuestion) {
      throw new ApiError({
        status: 404,
        message: "Question not found!",
      });
    }

    const prompt = `Generate a comprehensive, structured answer for the following academic question.Question (${
      existQuestion.marks
    } marks): ${convert(existQuestion.question)}
    Please provide:
    1. A clear and direct answer that addresses all parts of the question
    2. Relevant explanations of key concepts and terms
    3. Supporting evidence, examples, or case studies where appropriate
    4. Logical structure with clear paragraphs and transitions
    5. A brief conclusion that summarizes the main points

    The answer should be proportional to the marks assigned (${
      existQuestion.marks
    } marks). Use markdown formatting for headings, lists, and emphasis where appropriate.

    Focus on accuracy, clarity, and depth of understanding while avoiding unnecessary verbosity.
    
    And At last give me just answer.`;

    const result = await model.generateContent(prompt);

    const rawText = result.response.text();

    const htmlContent = convertMarkdownToHtml(rawText);

    await Answer.create({
      answer: htmlContent,
      userId: 22,
      questionId: questionId,
    });

    const responseData = {
      answer: {
        answer: htmlContent,
        user: {
          id: null,
          fullName: "StudyHere AI",
          profilePic: "https://studyhere.asigdel.com.np/icon192.png",
        },
      },
    };

    return new ApiResponse({
      status: 200,
      message: "Answer generated",
      data: responseData,
    }).send(res);
  }
);
