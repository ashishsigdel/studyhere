import dotenv from "dotenv";
dotenv.config();
export const isAllowedOrigin = (origin: any) => {
  if (!origin) return false;

  const allowedPatterns = process.env.ALLOWED_ORIGINS_REGEX
    ? process.env.ALLOWED_ORIGINS_REGEX.split(",").map(
        (pattern) => new RegExp(pattern)
      )
    : [
        /^https:\/\/([\w-]+\.)?studyhere\.vercel\.app$/,
        /^http:\/\/([\w-]+\.)?localhost:5100$/,
      ];

  return allowedPatterns.some((pattern) => pattern.test(origin));
};
