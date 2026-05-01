import { prisma } from "@/lib/prisma";
import { TokenType } from "@/generated/prisma";
import { Token } from "@/generated/prisma";

export class TokenRepository {
  async createEmailVerificationToken(params: { userId: string; token: string; expiresAt: Date }) {
    const { userId, token, expiresAt } = params;
    return prisma.token.create({
      data: {
        userId,
        token,
        expiresAt,
        type: TokenType.EMAIL_VERIFY,
      },
    });
  }

  async createRefreshToken(params: { userId: string; token: string; expiresAt: Date }) {
    const { userId, token, expiresAt } = params;
    return prisma.token.create({
      data: {
        userId,
        token,
        expiresAt,
        type: TokenType.REFRESH,
      },
    });
  }

  async revokeAllActiveRefreshTokensByUser(userId: string) {
    return prisma.token.updateMany({
      where: {
        userId,
        type: TokenType.REFRESH,
        revokedAt: null,
        consumedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async findActiveRefreshToken(token: string): Promise<Token | null> {
    return prisma.token.findFirst({
      where: {
        token,
        type: TokenType.REFRESH,
        consumedAt: null,
        revokedAt: null,
      },
    });
  }

  async findActiveEmailVerificationToken(token: string): Promise<Token | null> {
    return prisma.token.findFirst({
      where: {
        token,
        type: TokenType.EMAIL_VERIFY,
        consumedAt: null,
        revokedAt: null,
      },
    });
  }

  async revokeToken(id: string) {
    return prisma.token.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async consumeToken(id: string) {
    return prisma.token.update({
      where: { id },
      data: { consumedAt: new Date() },
    });
  }
}