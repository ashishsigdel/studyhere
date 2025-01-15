import Chapter from "@/models/chapter";
import Subject from "@/models/subject";
import { NextRequest, NextResponse } from "next/server";
import syncDatabase from "@/config/database";
syncDatabase();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, subjectId } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Chapter name is required." },
        { status: 400 }
      );
    }
    if (!subjectId) {
      return NextResponse.json(
        { message: "Subject is not valid." },
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
        { message: "Subject is not found." },
        { status: 404 }
      );
    }

    const nameExist = await Chapter.findOne({
      where: {
        name,
        subjectId,
      },
    });

    if (nameExist) {
      return NextResponse.json(
        { message: "Chapter already exists." },
        { status: 400 }
      );
    }

    const chapter = await Chapter.create({
      name,
      subjectId,
    });

    return NextResponse.json({ messsage: "Chapter Created!", data: chapter });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Something went wrong!", error: error },
      { status: 400 }
    );
  }
}
