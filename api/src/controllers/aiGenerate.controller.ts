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

    let answer = await Answer.findOne({
      where: { questionId, userId: 22 },
      attributes: ["id", "answer", "createdAt"],
      include: {
        model: User,
        attributes: ["id", "fullName", "profilePic"],
      },
    });

    let htmlContent = answer ? answer.answer : "";
    if (!answer) {
      const prompt = `Generate a comprehensive, structured in html (only body content and not also <body>) answer for the following academic question. The answer should be proportional to the marks assigned (${
        existQuestion.marks
      } marks) and Question: ${convert(existQuestion.question)}
    Please provide:
    1. A clear and direct answer that addresses all parts of the question
    2. Relevant explanations of key concepts and terms
    3. Supporting evidence, examples, or case studies where appropriate
    4. Logical structure with clear paragraphs and transitions
    5. A brief conclusion that summarizes the main points

    Use best html for formatting for headings, lists, table, and emphasis where appropriate.

    Focus on accuracy, clarity, and depth of understanding while avoiding unnecessary verbosity. and doesn't mention any here is html format or other things. Just write the answer`;

      const result = await model.generateContent(prompt);

      const rawText = result.response.text();

      const match = rawText.match(/```html\n([\s\S]*?)\n```/);
      htmlContent = match ? match[1] : rawText;

      await Answer.create({
        answer: htmlContent,
        userId: 22,
        questionId: questionId,
      });
    }

    const totalAnswers = await Answer.count({
      where: {
        questionId,
      },
    });

    const responseData = {
      answer: {
        answer: htmlContent,
        user: {
          id: 22,
          fullName: "StudyHere AI",
          profilePic: "https://studyhere.asigdel.com.np/icon192.png",
        },
      },
      otherAnswersCount: totalAnswers,
    };

    return new ApiResponse({
      status: 200,
      message: "Answer generated",
      data: responseData,
    }).send(res);
  }
);
