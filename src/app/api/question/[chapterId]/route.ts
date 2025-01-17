import Chapter from "@/models/chapter";
import Subject from "@/models/subject";
import { NextRequest, NextResponse } from "next/server";
import syncDatabase from "@/config/database";
import Question from "@/models/question";
import { Op, Sequelize } from "sequelize";
syncDatabase();

export async function GET(
  request: NextRequest,
  context: { params: { chapterId: string } }
) {
  try {
    const { chapterId } = await context.params;

    if (!chapterId) {
      return NextResponse.json(
        { message: "Chapter required!" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { message: "Chapter not found!" },
        { status: 404 }
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = url.searchParams.get("search") || "";
    const offset = (page - 1) * limit;

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

    return NextResponse.json({
      messsage: "Questions fetch.",
      data: {
        chapter: chapter,
        allQuestions,
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Something went wrong!", error: error },
      { status: 400 }
    );
  }
}
