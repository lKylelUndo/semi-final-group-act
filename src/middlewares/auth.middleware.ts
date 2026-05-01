import type { NextFunction, Request, Response } from "express";
import { refreshTokenService } from "@/services/auth";
import { verifyJwtToken } from "@/utils/jwt";

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  type: "access" | "refresh";
};

function setUserFromDecoded(req: Request, decoded: JwtPayload) {
  req.user = {
    id: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  };
}

export async function authenticateAccessToken(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "Missing or invalid authorization header",
    });
  }

  try {
    const decoded = verifyJwtToken(token) as JwtPayload;

    if (!decoded?.sub || decoded.type !== "access") {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Invalid access token",
      });
    }

    setUserFromDecoded(req, decoded);

    return next();
  } catch (error) {
    const isExpiredError =
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name: string }).name === "TokenExpiredError";

    if (isExpiredError) {
      const refreshToken = req.cookies?.refreshToken as string | undefined;

      if (!refreshToken) {
        return res.status(401).json({
          code: 401,
          status: "error",
          message: "Access token expired and refresh token is missing",
        });
      }

      const refreshResponse = await refreshTokenService(refreshToken);

      if (!(refreshResponse.status === "success" && "data" in refreshResponse)) {
        return res.status(refreshResponse.code).json(refreshResponse);
      }

      const tokenPair = refreshResponse.data;
      if (!tokenPair) {
        return res.status(500).json({
          code: 500,
          status: "error",
          message: "Unable to refresh access token",
        });
      }

      const newAccessToken = tokenPair.accessToken;
      const newRefreshToken = tokenPair.refreshToken;
      const decoded = verifyJwtToken(newAccessToken) as JwtPayload;

      setUserFromDecoded(req, decoded);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 15,
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.setHeader("x-access-token", newAccessToken);

      return next();
    }

    return res.status(401).json({
      code: 401,
      status: "error",
      message: "Access token is invalid",
    });
  }
}
