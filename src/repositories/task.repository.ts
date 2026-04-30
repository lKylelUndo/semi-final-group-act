import { prisma } from "@/lib/prisma";
import { TaskCreationInputType, TaskDeleteType, TaskUpdateType } from "@/schema/task";

export class TaskRepository {
    async create(data: TaskCreationInputType) {
        return await prisma.task.create({data});
    }

    async all() {
        return await prisma.task.findMany();
    }

    async single(id: any) {
        return await prisma.task.findUnique({
            where: id
        })
    }

    async update(data: TaskUpdateType) {
        const {id, ...updatedData} = data;

        return await prisma.task.update({
            where: { id },
            data: updatedData
        })
    }

    async delete(data: TaskDeleteType) {
        return await prisma.task.delete({
            where: { id: data.id}
        })
    }
}