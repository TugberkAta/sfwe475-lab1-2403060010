import { addTask, findTask } from "./tasks";
import { fetchTodo } from "./api";
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

// const ids = [1, 2, 3, 4, 5];

// async function fetchTodosSequentially(todoIds: number[]) {
//   const todos = [];
//   for (const id of todoIds) {
//     todos.push(await fetchTodo(id));
//   }
//   return todos;
// }

// async function main() {
//   console.time("sequential");
//   const sequential = await fetchTodosSequentially(ids);
//   console.timeEnd("sequential");
//   console.log(sequential);

//   console.time("parallel");
//   const parallel = await fetchTodos(ids);
//   console.timeEnd("parallel");
//   console.log(parallel);
// }

// main();
