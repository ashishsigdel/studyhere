import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/user";
import syncDatabase from "@/config/database";
import { generateTokens } from "@/utils/apis/generateToken";
import { serialize } from "cookie";

syncDatabase();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, profilePic } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { message: "Required fields missing." },
        { status: 400 }
      );
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({ fullName, email, profilePic });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set Access Token in Cookie
    const accessTokenCookie = serialize("session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Set Refresh Token in Cookie
    const refreshTokenCookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
    });

    const { password, ...userWithoutPassword } = user.toJSON();

    const response = NextResponse.json({
      message: "Logged in",
      data: userWithoutPassword,
    });

    response.headers.set(
      "Set-Cookie",
      `${accessTokenCookie}, ${refreshTokenCookie}`
    );

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Something went wrong!", error },
      { status: 400 }
    );
  }
}
