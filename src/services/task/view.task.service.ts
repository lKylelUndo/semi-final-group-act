import { TaskRepository } from "@/repositories/task.repository";

export async function viewTaskService(id: string) {
    const taskRepository = new TaskRepository();

    try {
        const viewTask = await taskRepository.single({id})
        
        if (!viewTask)
            return { code: 400, status: "error", message: "Unable to view a task" };

        
        return {
            code: 200,
            status: "success",
            message: "Getting specific task successfully!",
            data: { viewTask },
        };
    } catch (error) {
        console.error("ViewTaskService error", error);
        return { code: 500, status: "error", message: "Unable to view a task" };
    }
}