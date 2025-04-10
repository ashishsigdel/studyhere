import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Answer from "../models/answer";
import Question from "../models/question";
import ApiError from "../utils/apiError";
import User from "../models/user";
import ApiResponse from "../utils/apiResponse";
import { literal, Op } from "sequelize";

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
export const updateAnswerAdmin = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { answerId } = req.params;

    const user = req.user;
    if (user?.role !== "admin") {
      throw new ApiError({
        status: 403,
        message: "You are not authorized to update this answer!",
      });
    }

    if (!answerId) {
      throw new ApiError({
        status: 400,
        message: "Cannot update answer!",
      });
    }

    const existAnswer = await Answer.findByPk(answerId);

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

    // Fetch answers with computed like count and user-liked status
    let answers = await Answer.findAll({
      where: { questionId },
      attributes: ["id", "answer", "createdAt", "likes"],
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "profilePic", "role"],
        },
      ],
    });

    // Process answers
    let plainAnswers = answers.map((answer) => {
      const plainAnswer = answer.get({ plain: true });

      // Ensure `likes` is properly formatted
      const likesArray = plainAnswer.likes
        ? plainAnswer.likes.split("%").filter((id: number) => id)
        : [];

      return {
        ...plainAnswer,
        totalLikes: likesArray.length,
        isLiked: likesArray.includes(currentUserId?.toString()),
      };
    });

    // Sorting: Prioritize user's answer, then by likes
    plainAnswers.sort((a, b) => {
      if (a.user.id === currentUserId && b.user.id !== currentUserId) return -1;
      if (b.user.id === currentUserId && a.user.id !== currentUserId) return 1;
      return b.totalLikes - a.totalLikes;
    });

    return new ApiResponse({
      status: 200,
      message: "All Answers fetched!",
      data: {
        question: existQuestion,
        answers: plainAnswers.map((answer) => ({
          id: answer.id,
          answer: answer.answer,
          createdAt: answer.createdAt,
          totalLikes: answer.totalLikes,
          isLiked: answer.isLiked,
          user: answer.user,
        })),
      },
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

    // First try to find user's answer
    let answer = await Answer.findOne({
      where: { questionId, userId: currentUserId },
      attributes: ["id", "answer", "createdAt"],
      include: {
        model: User,
        attributes: ["id", "fullName", "profilePic", "role"],
      },
    });

    if (!answer) {
      answer = await Answer.findOne({
        where: { questionId },
        attributes: ["id", "answer", "createdAt"],
        include: {
          model: User,
          attributes: ["id", "fullName", "profilePic", "role"],
        },
        order: [
          [
            literal(`
            CASE 
              WHEN likes IS NULL THEN 0 
              ELSE (LENGTH(likes) - LENGTH(REPLACE(likes, '%', '')) + 1)
            END
          `),
            "DESC",
          ],
        ],
      });
    }

    // Get total count of other answers
    const totalAnswers = await Answer.count({
      where: {
        questionId,
        ...(answer && { id: { [Op.ne]: answer.id } }),
      },
    });

    // Convert to plain object and add computed fields
    let formattedAnswer = null;
    if (answer) {
      const plainAnswer = answer.get({ plain: true });
      formattedAnswer = {
        id: plainAnswer.id,
        answer: plainAnswer.answer,
        createdAt: plainAnswer.createdAt,
        user: plainAnswer.user,
      };
    }

    return new ApiResponse({
      status: 200,
      message: "Answer fetched!",
      data: {
        answer: formattedAnswer,
        otherAnswersCount: totalAnswers,
      },
    }).send(res);
  }
);

// Add this utility function to help manage likes
export const toggleLike = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { answerId } = req.params;
    const currentUserId = req.user?.id;

    if (!answerId || !currentUserId) {
      throw new ApiError({
        status: 400,
        message: "Answer ID and user authentication required!",
      });
    }

    const answer = await Answer.findByPk(answerId);
    if (!answer) {
      throw new ApiError({
        status: 404,
        message: "Answer not found!",
      });
    }

    // Ensure `likes` is always a valid string
    let likes = answer.likes ? answer.likes.split("%").filter((id) => id) : [];
    const userIdStr = currentUserId.toString();

    if (likes.includes(userIdStr)) {
      // Unlike: Remove user ID
      likes = likes.filter((id) => id !== userIdStr);
    } else {
      // Like: Add user ID
      likes.push(userIdStr);
    }

    // Edge case: Ensure empty array is stored as an empty string
    answer.likes = likes.length ? likes.join("%") : "";
    await answer.save();

    return new ApiResponse({
      status: 200,
      message: "Like status updated!",
      data: {
        isLiked: likes.includes(userIdStr),
        totalLikes: likes.length,
      },
    }).send(res);
  }
);
