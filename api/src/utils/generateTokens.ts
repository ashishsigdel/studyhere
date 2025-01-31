import jwt from "jsonwebtoken";

export const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "30d",
  });
  const refreshToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "360d",
  });
  return { accessToken, refreshToken };
};
