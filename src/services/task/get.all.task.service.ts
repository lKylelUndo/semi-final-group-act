import { TaskRepository } from "@/repositories/task.repository";

export async function getAllTaskService() {
  const taskRepository = new TaskRepository();

  try {
    const tasks = taskRepository.all();

    if (!tasks || Object.keys(tasks).length == 0)
      return {
        code: 400,
        status: "error",
        message: "Tasks empty",
      };

    return {
      code: 200,
      status: "success",
      message: "Getting all task successfully!",
      data: { tasks },
    };
  } catch (error) {
    console.error("GetAllTaskService error", error);
    return { code: 500, status: "error", message: "Unable to get all tasks" };
  }
}
