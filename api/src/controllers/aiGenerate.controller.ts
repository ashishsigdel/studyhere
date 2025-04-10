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
import Subject from "../models/subject";
import Chapter from "../models/chapter";

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

    const existQuestion = await Question.findByPk(questionId, {
      include: [
        {
          model: Chapter,
          attributes: ["id", "name", "subjectId"],
        },
      ],
    });
    let subjectname;
    if (
      existQuestion &&
      existQuestion.chapter &&
      existQuestion.chapter.subjectId
    ) {
      const subject = await Subject.findByPk(existQuestion.chapter.subjectId);
      subjectname = subject?.name;
    }

    if (!existQuestion) {
      throw new ApiError({
        status: 404,
        message: "Question not found!",
      });
    }

    let htmlContent = "";

    const prompt = `Generate a well-structured, easy-to-understand, human like very simple, not long, and concise answer in HTML (only body content, excluding <body>) for the following academic question from the ${subjectname} subject, specifically from the ${
      existQuestion?.chapter.name
    } chapter.  

    The answer should be proportional to the assigned marks (${
      existQuestion.marks
    } marks) and should directly address the following question:  
    **${convert(existQuestion.question)}**  

    ### Requirements:
    1. Provide a **clear and direct answer** covering all parts of the question.  
    2. Explain key concepts and terms in **simple, human-like language**.  
    3. Include **examples, case studies, or supporting evidence** where relevant.  
    4. Maintain **logical structure** with well-defined paragraphs and smooth transitions.  
    5. Use **HTML formatting** for headings, lists, tables, and emphasis to improve readability.  
    6. Conclude with a **brief summary** of the main points.  

    Ensure accuracy, clarity, and depth without unnecessary complexity. The output should feel **natural and easy to remember**, without mentioning anything about HTML formatting or structure explicitly—just present the well-formatted answer itself.`;

    const result = await model.generateContent(prompt);

    const rawText = result.response.text();

    const match = rawText.match(/```html\n([\s\S]*?)\n```/);
    htmlContent = match ? match[1] : rawText;

    await Answer.create({
      answer: htmlContent,
      userId: 22,
      questionId: questionId,
    });

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
          role: "ai",
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
