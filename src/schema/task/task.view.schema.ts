import { z } from "zod";

export const taskViewSchema = z.object({
  body: z.object({
    id: z.string({ message: "Id is required" }),
  }),
});

export type TaskViewType = z.infer<typeof taskViewSchema>["body"];
