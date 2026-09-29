export type Task = {
  id: number;
  title: string;
  done: boolean;
  dueDate?: string;
};
export function addTask(tasks: Task[], title: string): Task[] {
  const id = tasks.length + 1;
  return [...tasks, { id, title, done: false }];
}
export function findTask(
  tasks: Task[],
  id: number,
): { ok: true; task: Task } | { ok: false; error: string } {
  const task = tasks.find((t) => t.id === id);
  if (task === undefined) {
    return { ok: false, error: `No task found with id ${id}` };
  }
  return { ok: true, task };
}
export function toggleTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task,
  );
}
export function filterTasks(
  tasks: Task[],
  filter: "all" | "done" | "open",
): Task[] {
  return tasks.filter((task) => {
    if (filter === "done") return task.done;
    if (filter === "open") return !task.done;
    return true;
  });
}
export function daysUntilDue(task: Task): number {
  if (task.dueDate === undefined) {
    throw new Error("Task has no due date");
  }
  const due = new Date(task.dueDate);
  return Math.ceil((due.getTime() - Date.now()) / 86_400_000);
}
