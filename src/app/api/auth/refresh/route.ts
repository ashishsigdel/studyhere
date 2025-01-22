import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateTokens } from "../../../../utils/apis/generateToken";
import { serialize, parse } from "cookie";
import User from "../../../../models/user";
import syncDatabase from "../../../../config/database";

syncDatabase();

export async function POST(req: NextRequest) {
  try {
    // Get refresh token from cookies
    const cookies = req.headers.get("cookie");
    const parsedCookies = cookies ? parse(cookies) : {};
    const refreshToken = parsedCookies.refreshToken;

    if (!refreshToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 403 }
      );
    }

    // Find user in database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id
    );

    // Set new cookies
    const accessTokenCookie = serialize("session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    const refreshTokenCookie = serialize("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    const response = NextResponse.json({ message: "Token refreshed" });
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
