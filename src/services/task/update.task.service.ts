import { TaskRepository } from "@/repositories/task.repository";

export async function updateTaskService(id: string, task_title: string, task_description: string, task_date: string) {
    const taskRepository = new TaskRepository();

    try {
        const updatedTask = await taskRepository.update({id, task_title, task_description, task_date})
        
        if (!updatedTask)
            return { code: 400, status: "error", message: "Unable to update a task" };

        
        return {
            code: 200,
            status: "success",
            message: "Update task successfully!",
            data: { updatedTask },
        };
    } catch (error) {
        console.error("UpdateTaskService error", error);
        return { code: 500, status: "error", message: "Unable to update a task" };
    }
}