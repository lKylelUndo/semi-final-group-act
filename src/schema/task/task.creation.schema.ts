import { z } from "zod";

export const taskCreationSchema = z.object({
  body: z.object({
    userId: z.string({message: "User id is required!"}),
    task_title: z.string({ message: "Title is required!" }),
    task_description: z.string({ message: "Task Description is required!" }),
    task_date: z.string({ message: "Completion date is required!" }),
  }),
});

export type TaskCreationInputType = z.infer<typeof taskCreationSchema>["body"];
