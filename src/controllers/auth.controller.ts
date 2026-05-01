import { Request, Response } from "express";
import { loginService, refreshTokenService, signupService, verifyEmailService } from "@/services/auth";

export class AuthController {
  public signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body ?? {};
    const response = await signupService(name, email, password);
    return res.status(response.code).json(response);
  }

  public verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query ?? {};
    const response = await verifyEmailService(token as string);
    return res.status(response.code).json(response);
  }

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    const response = await loginService(email, password);
    if (response.status === "success" && "data" in response && response.data?.refreshToken) {
      res.cookie("accessToken", response.data.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 15,
      });
      res.cookie("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }
    return res.status(response.code).json(response);
  }

  public refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken ?? req.cookies?.refreshToken;
    const response = await refreshTokenService(refreshToken);
    if (response.status === "success" && "data" in response && response.data?.refreshToken) {
      res.cookie("accessToken", response.data.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 15,
      });
      res.cookie("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }
    return res.status(response.code).json(response);
  }
}