import { z } from "zod";
import { CreateTask, CreateTaskSchema } from "../schemas";

type CreateTaskFailure = {
  index: number;
  error: ReturnType<z.ZodError<CreateTask>["flatten"]>;
};

export function createTask(payload: unknown) {
  const result = CreateTaskSchema.safeParse(payload);

  if (!result.success) {
    return { ok: false as const, error: result.error.flatten() };
  }

  return { ok: true as const, task: result.data };
}

export function createTasks(payload: unknown) {
  const list = z.array(z.unknown()).safeParse(payload);

  if (!list.success) {
    return { ok: false as const, error: list.error.flatten() };
  }

  const succeeded: { index: number; task: CreateTask }[] = [];
  const failed: CreateTaskFailure[] = [];

  list.data.forEach((item, index) => {
    const result = CreateTaskSchema.safeParse(item);
    if (result.success) {
      succeeded.push({ index, task: result.data });
    } else {
      failed.push({ index, error: result.error.flatten() });
    }
  });

  return { ok: true as const, succeeded, failed };
}
