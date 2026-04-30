import { TaskRepository } from "@/repositories/task.repository";

export async function addTaskService(task_title: string, task_description: string, task_date: string, userId: string) {
    const taskRepository = new TaskRepository();

    try {
        const task = taskRepository.create({task_title, task_description, task_date, userId})

        if (!task)
            return {code: 400, status: "error", message: "Unable to add task"};

        return {
            code: 201,
            status: "success",
            message: "Created Task successfully!",
            data: { task },
        };
    } catch (error) {
        console.error("AddTaskService error", error);
        return { code: 500, status: "error", message: "Unable to add task" };
    }
}