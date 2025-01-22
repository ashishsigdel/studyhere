import { NextRequest, NextResponse } from "next/server";
import Subject from "../../../models/subject";
import syncDatabase from "../../../config/database";
syncDatabase();

export async function GET(req: NextRequest) {
  try {
    const allSubject = await Subject.findAll();

    return NextResponse.json({
      messsage: "Subjects fetched",
      data: allSubject,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Something went wrong!", error: error },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Subject is required." },
        { status: 400 }
      );
    }

    const nameExist = await Subject.findOne({
      where: {
        name,
      },
    });

    if (nameExist) {
      return NextResponse.json(
        { message: "Subject already exists." },
        { status: 400 }
      );
    }

    const subject = await Subject.create({
      name,
    });

    return NextResponse.json({ messsage: "Subject Created!", data: subject });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Something went wrong!", error: error },
      { status: 400 }
    );
  }
}
