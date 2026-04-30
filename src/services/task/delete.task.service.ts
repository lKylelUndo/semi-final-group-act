import { TaskRepository } from "@/repositories/task.repository";

export async function deleteTaskService(id: string) {
  const taskRepository = new TaskRepository();

  try {
    const deletedTask = await taskRepository.delete({ id });

    if (!deletedTask)
      return { code: 400, status: "error", message: "Unable to delete task" };

    return {
      code: 201,
      status: "success",
      message: "Delete Task successfully!",
      data: { deletedTask },
    };
  } catch (error) {
    console.error("DeleteTaskService error", error);
    return { code: 500, status: "error", message: "Unable to delete a task" };
  }
}
