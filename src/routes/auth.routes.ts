import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validateSchema } from "@/middlewares/validate-schema.middleware";
import { loginSchema, refreshTokenSchema, signupSchema, verifyEmailSchema } from "@/schema/auth";


const router = Router();
const authController = new AuthController();

router.post("/v1/signup", validateSchema(signupSchema), authController.signup);
router.get("/v1/verify-email", validateSchema(verifyEmailSchema), authController.verifyEmail);
router.post("/v1/login", validateSchema(loginSchema), authController.login);
router.post("/v1/refresh-token", validateSchema(refreshTokenSchema), authController.refreshToken);

export default router;