import { NextRequest, NextResponse } from "next/server";
import syncDatabase from "../../../config/database";
import Chapter from "../../../models/chapter";
import Question from "../../../models/question";
syncDatabase();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { question, answer, chapterId, year, marks } = body;

    if (!question) {
      return NextResponse.json(
        { message: "Question is required." },
        { status: 400 }
      );
    }
    if (!chapterId) {
      return NextResponse.json(
        { message: "Chapter is not valid." },
        { status: 400 }
      );
    }

    const chapter = await Chapter.findOne({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { message: "Chapter is not found." },
        { status: 404 }
      );
    }

    const newQuestion = await Question.create({
      question,
      chapterId,
      answer,
      year,
      marks,
    });

    return NextResponse.json({
      messsage: "Chapter Created!",
      data: newQuestion,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Something went wrong!", error: error },
      { status: 400 }
    );
  }
}
