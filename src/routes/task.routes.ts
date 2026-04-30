import taskController from "@/controllers/task.controller";
import { validateSchema } from "@/middlewares/validate-schema.middleware";
import { taskCreationSchema, taskDeleteSchema, taskUpdateSchema } from "@/schema/task";
import { taskViewSchema } from "@/schema/task/task.view.schema";
import { Router } from "express";

const router = Router();

router.get("/v1/view-task", validateSchema(taskViewSchema), taskController.getOneTask);
router.get("/v1/get-all-tasks", taskController.getAllTasks);
router.post("/v1/add-task", validateSchema(taskCreationSchema), taskController.addTask);
router.put("/v1/update-task", validateSchema(taskUpdateSchema), taskController.updateTask);
router.delete("/v1/delete-task", validateSchema(taskDeleteSchema), taskController.deleteTask)

export default router;