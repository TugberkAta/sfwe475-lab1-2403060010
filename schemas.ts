import { z } from "zod";

export const TaskSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  done: z.boolean(),
  dueDate: z.string().optional(),
});

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  done: true,
});

export const TaskListSchema = z.array(TaskSchema);

export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type TaskList = z.infer<typeof TaskListSchema>;
