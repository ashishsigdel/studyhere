import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";

import Subject from "../models/subject";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import Chapter from "../models/chapter";
import { Op, Sequelize } from "sequelize";
import Question from "../models/question";
import User from "../models/user";
import Answer from "../models/answer";

interface CustomRequest extends Request {
  user?: InstanceType<typeof User>;
}

export const fetchQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { chapterId } = req.params;

    if (!chapterId) {
      throw new ApiError({
        status: 400,
        message: "Chapter required!",
      });
    }

    const chapter = await Chapter.findOne({
      where: {
        id: chapterId,
      },
      attributes: ["id", "name"],
      include: {
        model: Subject,
        attributes: ["id", "name"],
        as: "subject",
      },
    });

    if (!chapter) {
      throw new ApiError({
        status: 404,
        message: "Chapter not found!",
      });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const offset = (page - 1) * limit;
    const search = (req.query.search as string) || "";

    const whereCondition: any = {
      chapterId,
    };

    if (search) {
      whereCondition[Op.or] = [
        {
          question: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          answer: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          year: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows: allQuestions } = await Question.findAndCountAll({
      where: whereCondition,
      order: [
        [
          Sequelize.literal("CAST(SUBSTRING_INDEX(year, ' ', 1) AS UNSIGNED)"),
          "DESC",
        ],
      ],
      limit,
      offset,
    });

    return new ApiResponse({
      status: 200,
      message: "Questions fetch.",
      data: {
        chapter: chapter,
        allQuestions,
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    }).send(res);
  }
);

export const createQustion = asyncHandler(
  async (req: Request, res: Response) => {
    const { question, answer, year, marks, createdBy } = req.body;

    if (!question) {
      throw new ApiError({
        status: 400,
        message: "Question required!",
      });
    }

    const { chapterId } = req.params;

    if (!chapterId) {
      throw new ApiError({
        status: 400,
        message: "Chapter is not valid.",
      });
    }

    const chapter = await Chapter.findOne({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      throw new ApiError({
        status: 404,
        message: "Chapter is not found.",
      });
    }

    const newQuestion = await Question.create({
      question,
      chapterId,
      answer,
      year,
      marks,
      createdBy,
    });

    return new ApiResponse({
      message: "Chapter created!",
      data: newQuestion,
    }).send(res);
  }
);

export const updateQustion = asyncHandler(
  async (req: Request, res: Response) => {
    const { questionId } = req.params;

    if (!questionId) {
      throw new ApiError({
        status: 400,
        message: "Question ID is required.",
      });
    }

    const existingQuestion = await Question.findByPk(
      questionId as unknown as string
    );
    if (!existingQuestion) {
      throw new ApiError({
        status: 404,
        message: "Question not found.",
      });
    }

    await existingQuestion.update({
      question: req.body.question ?? existingQuestion.question,
      chapterId: req.body.chapterId ?? existingQuestion.chapterId,
      answer: req.body.answer ?? existingQuestion.answer,
      year: req.body.year ?? existingQuestion.year,
      marks: req.body.marks ?? existingQuestion.marks,
    });

    return new ApiResponse({
      message: "Question updated successfully!",
      data: existingQuestion,
    }).send(res);
  }
);

export const deleteQuestion = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { questionId } = req.params;
    if (!questionId) {
      throw new ApiError({
        status: 400,
        message: "Question ID is required.",
      });
    }

    const question = await Question.findByPk(questionId as unknown as string);

    if (!question) {
      throw new ApiError({
        status: 404,
        message: "Question not found.",
      });
    }

    if (req.user?.role !== "admin" && question.createdBy !== req.user?.id) {
      throw new ApiError({
        status: 403,
        message: "You are not authorized to delete this question.",
      });
    }

    await question.destroy();

    await Answer.destroy({
      where: {
        questionId: question.id,
      },
    });

    return new ApiResponse({
      message: "Question deleted successfully!",
    }).send(res);
  }
);
