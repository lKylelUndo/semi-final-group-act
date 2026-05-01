import { UserRepository } from "@/repositories/user.repository";
import { TokenRepository } from "@/repositories/token.repository";
import { verifyPassword } from "@/utils/password-hashing";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";

export async function loginService(email: string, password: string) {
  const userRepository = new UserRepository();
  const tokenRepository = new TokenRepository();

  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { code: 401, status: "error", message: "Invalid credentials" };
    }

    const isValidPassword = verifyPassword(password, user.password);
    if (!isValidPassword) {
      return { code: 401, status: "error", message: "Invalid credentials" };
    }

    if (!user.emailVerified) {
      return { code: 403, status: "error", message: "Please verify your email first" };
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email ?? "",
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email ?? "",
      role: user.role,
    });

    await tokenRepository.revokeAllActiveRefreshTokensByUser(user.id);
    await tokenRepository.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return {
      code: 200,
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  } catch (error) {
    console.error("LoginService error", error);
    return { code: 500, status: "error", message: "Unable to login user" };
  }
}
