import { Request, Response } from "express";
import { signupService, verifyEmailService } from "@/services/auth";

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
}