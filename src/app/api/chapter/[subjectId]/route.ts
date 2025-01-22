import Chapter from "../../../../models/chapter";
import { NextRequest, NextResponse } from "next/server";
import syncDatabase from "../../../../config/database";
import Subject from "../../../../models/subject";
syncDatabase();

export async function GET(
  request: NextRequest,
  context: { params: { subjectId: string } }
) {
  try {
    const { subjectId } = await context.params;

    if (!subjectId) {
      return NextResponse.json(
        { message: "Subject required!" },
        { status: 400 }
      );
    }

    const subject = await Subject.findOne({
      where: {
        id: subjectId,
      },
    });

    if (!subject) {
      return NextResponse.json(
        { message: "Subject not found!" },
        { status: 404 }
      );
    }

    const allChapters = await Chapter.findAll({
      where: {
        subjectId: subjectId,
      },
    });

    return NextResponse.json({
      messsage: "Chapters fetch.",
      data: {
        subject: subject.name,
        chapters: allChapters,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Something went wrong!", error: error },
      { status: 400 }
    );
  }
}
