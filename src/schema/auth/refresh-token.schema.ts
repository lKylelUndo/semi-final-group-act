import { z } from "zod";

export const refreshTokenSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(1, "Refresh token cannot be empty").optional(),
    })
    .optional(),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];
