import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Custom interface for JWT payload
interface CustomJwtPayload extends JwtPayload {
  rfId?: number;
  id?: number;
}

interface GenerateTokenParams {
  payload: object;
  expiresIn: number;
}

interface VerifyTokenParams {
  token: string;
  ignoreExpiration?: boolean;
}

interface GenerateRefreshTokenParams {
  userId: number;
}

interface GenerateAccessTokenParams {
  userId: number;
  refreshTokenId: number;
}

export const verifyToken = ({
  token,
  ignoreExpiration = false,
}: VerifyTokenParams): CustomJwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, {
    issuer: process.env.JWT_ISSUER,
    algorithms: ["HS512"],
    ignoreExpiration: ignoreExpiration,
  }) as CustomJwtPayload;
};

export const removeBearer = (token: string): string => {
  if (token && token.startsWith("Bearer ")) {
    return token.slice(7, token.length);
  }
  return token;
};

export const getAuthToken = (req: Request): string | null => {
  if (
    req &&
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

export const getCookieToken = (req: Request): string | null => {
  if (req && req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken.split(" ")[1];
  }
  return null;
};

export const generateToken = ({
  payload,
  expiresIn,
}: GenerateTokenParams): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: expiresIn,
    issuer: process.env.JWT_ISSUER,
    algorithm: "HS512",
  });
};

export const generateRefreshToken = ({
  userId,
}: GenerateRefreshTokenParams): string => {
  return generateToken({
    payload: {
      id: userId,
    },
    expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string, 10),
  });
};

export const generateAccessToken = ({
  userId,
  refreshTokenId,
}: GenerateAccessTokenParams): string => {
  return generateToken({
    payload: {
      id: userId,
      rfId: refreshTokenId,
    },
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string, 10),
  });
};

export const getDateAfterMinutes = (minutes: number) => {
  return new Date(Date.now() + minutes * 60000); // convert minutes to milliseconds
};

export const getDateBeforeMinutes = (minutes: number) => {
  return new Date(Date.now() - minutes * 60000); // convert minutes to milliseconds
};
