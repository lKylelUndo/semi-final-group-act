import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";

type TokenPayload = {
  sub: string;
  email: string;
  role: string;
  type: "access" | "refresh";
};

const ACCESS_TOKEN_EXPIRES_IN = "10m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export function generateAccessToken(user: { id: string; email: string; role: string }) {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: "access",
  };

  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

export function generateRefreshToken(user: { id: string; email: string; role: string }) {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: "refresh",
  };

  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

export function verifyJwtToken(token: string) {
  return jwt.verify(token, ENV.JWT_SECRET);
}
