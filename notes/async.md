While `await fetch(...)` is waiting for a response, this function pauses at that line, so the statements after the `await` do not run yet. The rest of the program is still allowed to keep going: the event loop can run other callbacks, timers, and other async functions that are already ready to continue. The request itself is handled outside the JavaScript thread, so waiting on it does not freeze the whole program.

The parallel version is faster because `Promise.all` starts every request at once and the waits overlap, while a loop that awaits each fetch finishes one request before starting the next and therefore adds those waits together.

A real application still needs a timeout when the server is usually fast, because `fetch` has no deadline of its own. "Usually" is an average: DNS, TLS, a congested network, or a server that accepted the connection and then stopped sending can leave one request hanging with no response at all. Until that promise settles, the caller stays stuck — a loading state never ends, a retry never starts, and the open connection is held indefinitely. Three seconds is a bound on that worst case. Aborting the request makes `fetch` reject, and that rejection is handled as a failure just like any other request that does not succeed.

TypeScript stayed silent because `response.json()` is typed as `Promise<any>`, so the parsed body can be returned as a `Task` without the compiler checking that a `done` field exists. The return type `Promise<Task | null>` is a claim the function makes, and `npm run typecheck` accepts it. The mismatch became visible only when the program ran: the logged object is `{ userId: 1, id: 1, title: 'delectus aut autem', completed: false }`, and `todo.done` prints `undefined` because the API body has `completed` and no `done`. That gap — a type describing data the program never checked — is what Strand 3 and 4 close.

`daysUntilDue` in `src/tasks.ts` is another place data crosses a boundary without being checked. After the missing-date guard, `task.dueDate` is only known to be a `string`, and `new Date(task.dueDate)` accepts that string with no check that it names a real calendar date. The boundary is the step from text into a date calculation: `"tomorrow"` satisfies the type, then `getTime()` is `NaN` and the returned number is meaningless.

`TaskSchema.safeParse` returned `success: true` for `{ id: 1, title: "Read", done: false }`. The other two objects failed, and `result.error.issues` was:

Missing `title` (`{ id: 2, done: true }`):

```
[
  {
    expected: 'string',
    code: 'invalid_type',
    path: [ 'title' ],
    message: 'Invalid input: expected string, received undefined'
  }
]
```

This issue is about a field that never arrived. `path` names `title`, `expected` says that field must be a string, and the received value is `undefined` because the property is absent. Zod is reporting a missing required field, not a value of the wrong type.

Wrong type for `done` (`{ id: 3, title: "Write", done: "yes" }`):

```
[
  {
    expected: 'boolean',
    code: 'invalid_type',
    path: [ 'done' ],
    message: 'Invalid input: expected boolean, received string'
  }
]
```

This issue is about a field that is present but has the wrong type. `path` names `done`, and the message says a boolean was required while a string was received. `"yes"` is text, so it does not satisfy `z.boolean()` even though the property exists.

`createTask` takes `payload: unknown` because that argument is data the function has not checked yet. A request body, `JSON.parse`, or any other value from outside the program can be a number, a string, `null`, or an object with the wrong fields. `unknown` is the honest type for that: it means the value exists, and nothing more. TypeScript will not let the function read `payload.title` or pass `payload` where a `Task` is required. The only way out is a check that narrows it. `CreateTaskSchema.safeParse` is that check. On `result.success`, `result.data` has type `CreateTask` because the schema actually accepted the value. Until that branch, the payload stays untrusted.

Annotating that parameter as `Task` would repeat the Strand 2 mistake. `fetchTodo` claimed `Promise<Task | null>` while `response.json()` was `Promise<any>`, so `npm run typecheck` accepted a `Task` the function never checked. The body had `completed` and no `done`, and `todo.done` was `undefined` only once the program ran. A `Task` parameter is that same claim moved to the argument: it tells the compiler the payload is already a task, so the function could use `payload.done` and skip `safeParse` and the types would still pass. Callers holding a raw body would have to write `as Task` to get it through the parameter, which is another assertion standing in for a check. The type would again describe data the program never validated. `unknown` keeps the boundary at `safeParse`, where the shape is proven instead of declared.
