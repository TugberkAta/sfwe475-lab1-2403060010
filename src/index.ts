import { addTask, findTask } from "./tasks";
import { Task } from "../schemas";

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
