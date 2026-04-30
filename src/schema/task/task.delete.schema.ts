import { z } from "zod";

export const taskDeleteSchema = z.object({
  body: z.object({
    id: z.string({ message: "Id is required" }),
  }),
});

export type TaskDeleteType = z.infer<typeof taskDeleteSchema>["body"];
