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
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface CustomRequest extends Request {
  user?: InstanceType<typeof User>;
}

const convertMarkdownToHtml = (text: string): string => {
  // Convert bold text (**text**) to <strong>text</strong>
  const boldRegex = /\*\*(.*?)\*\*/g;
  const htmlText = text.replace(boldRegex, "<strong>$1</strong>");

  // Convert lists (assuming '*' or '-' for bullet points)
  const listItemRegex = /^\s*[\*\-]\s+(.*)$/gm;
  let processedText = htmlText;

  // Check if there are list items
  if (listItemRegex.test(htmlText)) {
    // Reset regex lastIndex
    listItemRegex.lastIndex = 0;

    // Wrap list items with <ul> and <li> tags
    const lines = htmlText.split("\n");
    let inList = false;

    processedText = lines
      .map((line) => {
        const listMatch = line.match(/^\s*[\*\-]\s+(.*)/);

        if (listMatch) {
          const prefix = !inList ? "<ul>\n" : "";
          inList = true;
          return `${prefix}<li>${listMatch[1]}</li>`;
        } else {
          const suffix = inList ? "</ul>\n" : "";
          inList = false;
          return `${suffix}${line}`;
        }
      })
      .join("\n");

    if (inList) {
      processedText += "\n</ul>";
    }
  }
  const headerRegex = /^##\s+(.*)$/gm;
  processedText = processedText.replace(headerRegex, "<h2>$1</h2>");

  const paragraphs = processedText.split(/\n\s*\n/);
  processedText = paragraphs
    .map((para) => {
      if (para.trim() === "" || /<\/?[a-z][\s\S]*>/i.test(para)) {
        return para;
      }
      return `<p>${para}</p>`;
    })
    .join("\n\n");

  return processedText;
};

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

    const prompt = `Generate a well-structured answer for the following question, ensuring the length and detail align with the marks allotted. The answer should be concise, but detailed enough to provide a thorough explanation : marks:${
      existQuestion.marks
    } question:${convert(existQuestion.question)}`;

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
