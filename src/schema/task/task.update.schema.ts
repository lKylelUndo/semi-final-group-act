import { z } from "zod";

export const taskUpdateSchema = z.object({
  body: z.object({
    id: z.string({ message: "Id is required" }),
    task_title: z.string().optional(),
    task_description: z.string().optional(),
    task_date: z.string().optional(),
  }),
});

export type TaskUpdateType = z.infer<typeof taskUpdateSchema>["body"];
