import { addTask, findTask, type Task } from "./tasks";
let tasks: Task[] = [];
tasks = addTask(tasks, "Read Chapter 1");
const first = findTask(tasks, 1);
if (first.ok) {
  console.log(first.task.title);
}
const missing = findTask(tasks, 99);
if (missing.ok) {
  console.log(missing.task.title);
} else {
  console.log(missing.error);
}
