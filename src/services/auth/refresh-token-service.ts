import { TokenRepository } from "@/repositories/token.repository";
import { UserRepository } from "@/repositories/user.repository";
import { generateAccessToken, generateRefreshToken, verifyJwtToken } from "@/utils/jwt";

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  type: "access" | "refresh";
};

export async function refreshTokenService(refreshToken: string) {
  const tokenRepository = new TokenRepository();
  const userRepository = new UserRepository();

  try {
    if (!refreshToken) {
      return { code: 401, status: "error", message: "Refresh token is required" };
    }

    const storedToken = await tokenRepository.findActiveRefreshToken(refreshToken);
    if (!storedToken) {
      return { code: 401, status: "error", message: "Invalid refresh token" };
    }

    if (storedToken.expiresAt.getTime() < Date.now()) {
      await tokenRepository.revokeToken(storedToken.id);
      return { code: 401, status: "error", message: "Refresh token has expired. Please login again" };
    }

    let decoded: JwtPayload;
    try {
      decoded = verifyJwtToken(refreshToken) as JwtPayload;
    } catch {
      await tokenRepository.revokeToken(storedToken.id);
      return { code: 401, status: "error", message: "Refresh token is invalid or expired" };
    }

    if (decoded.type !== "refresh" || decoded.sub !== storedToken.userId) {
      await tokenRepository.revokeToken(storedToken.id);
      return { code: 401, status: "error", message: "Invalid refresh token payload" };
    }

    const user = await userRepository.findById(storedToken.userId);
    if (!user || !user.email) {
      await tokenRepository.revokeToken(storedToken.id);
      return { code: 404, status: "error", message: "User not found" };
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await tokenRepository.revokeToken(storedToken.id);
    await tokenRepository.createRefreshToken({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return {
      code: 200,
      status: "success",
      message: "Access token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  } catch (error) {
    console.error("RefreshTokenService error", error);
    return { code: 500, status: "error", message: "Unable to refresh token" };
  }
}
