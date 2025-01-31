import jwt from "jsonwebtoken";

export const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
  return { accessToken };
};
