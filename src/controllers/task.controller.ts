import { addTaskService, deleteTaskService, getAllTaskService, updateTaskService } from "@/services/task";
import type { Request, Response } from "express";

class TaskController {
  async getAllTasks(req: Request, res: Response) {
    const response = await getAllTaskService();
    return res.status(response.code).json(response);
  }

  async addTask(req: Request, res: Response) {
    const { task_title, task_description, task_date, userId } = req.body ?? {};
    const response = await addTaskService(task_title, task_description, task_date, userId);
    return res.status(response.code).json(response);
  }

  async updateTask(req: Request, res: Response) {
    const { id, task_title, task_description, task_date } = req.body ?? {};
    const response = await updateTaskService(id, task_title, task_description, task_date);
    return res.status(response.code).json(response);
  }

  async deleteTask(req: Request, res: Response) {
    const { id } = req.body ?? {};
    const response = await deleteTaskService(id);
    return res.status(response.code).json(response);
  }
}

export default new TaskController();
