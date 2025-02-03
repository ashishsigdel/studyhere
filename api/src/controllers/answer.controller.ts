import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Answer from "../models/answer";
import Question from "../models/question";
import ApiError from "../utils/apiError";
import User from "../models/user";
import ApiResponse from "../utils/apiResponse";

interface CustomRequest extends Request {
  user?: InstanceType<typeof User>;
}

export const addAnswer = asyncHandler(
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

    const user = req.user;

    const existingAnswer = await Answer.findOne({
      where: { questionId, userId: user?.id },
    });

    if (existingAnswer) {
      throw new ApiError({
        status: 400,
        message: "You have already added an answer to this question!",
      });
    }

    const { answer } = req.body;

    if (!answer) {
      throw new ApiError({
        status: 400,
        message: "Answer is required!",
      });
    }

    const ans = await Answer.create({
      answer,
      userId: user?.id,
      questionId: questionId,
    });

    return new ApiResponse({
      status: 201,
      message: "Answer created successfully!",
      data: ans,
    }).send(res);
  }
);
export const updateAnswer = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { questionId } = req.params;

    if (!questionId) {
      throw new ApiError({
        status: 400,
        message: "Cannot update answer!",
      });
    }

    const user = req.user;

    const existAnswer = await Answer.findOne({
      where: {
        questionId,
        userId: user?.id,
      },
    });

    if (!existAnswer) {
      throw new ApiError({
        status: 404,
        message: "Answer not found!",
      });
    }

    const { answer } = req.body;

    if (!answer) {
      throw new ApiError({
        status: 400,
        message: "Answer is required!",
      });
    }

    if (existAnswer.userId !== user?.id) {
      throw new ApiError({
        status: 403,
        message: "You are not authorized to update this answer!",
      });
    }

    await existAnswer.update({ answer });

    return new ApiResponse({
      status: 200,
      message: "Answer updated successfully!",
    }).send(res);
  }
);
export const getAnswersByQuestionId = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { questionId } = req.params;
    const currentUserId = req.user?.id; // Assuming user info is in req.user

    if (!questionId) {
      throw new ApiError({
        status: 400,
        message: "Question ID is required!",
      });
    }

    const existQuestion = await Question.findByPk(questionId);

    if (!existQuestion) {
      throw new ApiError({
        status: 404,
        message: "Question not found!",
      });
    }

    let answers = await Answer.findAll({
      where: { questionId },
      attributes: ["id", "answer", "createdAt"],
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "profilePic"],
        },
      ],
    });

    // Move the current user's answer to the top
    if (currentUserId) {
      answers = answers.sort((a, b) => (a.userId === currentUserId ? -1 : 1));
    }

    return new ApiResponse({
      status: 200,
      message: "All Answers fetched!",
      data: answers,
    }).send(res);
  }
);

export const getYourAnswersByQuestionId = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { questionId } = req.params;
    const currentUserId = req.user?.id;

    if (!questionId) {
      throw new ApiError({
        status: 400,
        message: "Question ID is required!",
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
      where: { questionId, userId: currentUserId },
      attributes: ["id", "answer", "createdAt"],
      include: {
        model: User,
        attributes: ["id", "fullName", "profilePic"],
      },
    });

    if (!answer) {
      answer = await Answer.findOne({
        where: { questionId },
        attributes: ["id", "answer", "createdAt"],
        include: {
          model: User,
          attributes: ["id", "fullName", "profilePic"],
        },
      });
    }

    return new ApiResponse({
      status: 200,
      message: "Answer fetched!",
      data: answer,
    }).send(res);
  }
);
