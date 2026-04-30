import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import taskRoutes from "@/routes/task.routes"

const router = Router();

// Auth Routes
router.use("/auth", authRoutes);

// Task Routes
router.use("/task", taskRoutes);

export default router;