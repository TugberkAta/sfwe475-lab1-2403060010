import { Task, TaskSchema } from "../schemas";

export async function fetchTodo(id: number): Promise<Task | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      { signal: controller.signal },
    );
    if (!response.ok) {
      return null;
    }
    const data: unknown = await response.json();
    const result = TaskSchema.safeParse(data);
    if (!result.success) {
      return null;
    }
    return result.data;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchTodos(ids: number[]) {
  return Promise.all(ids.map((id) => fetchTodo(id)));
}
