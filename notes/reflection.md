1. A 404 means the server understood the request, but the resource does not exist, so the mistake is on the client side. A 500 means the server failed while handling the request, even if the request itself was valid. Both are errors, but 404 is in the 4xx family and 500 is in the 5xx family.

2. `tasks.find(...)` returns the matching `Task` or `undefined` when no id matches, so its type is `Task | undefined`. A function that promises to return a `Task` claims a task is always present. Strict mode rejects that return because the missing-task case is still possible and is not a `Task`.

3. `main` should stay a stable history, with only the starter commit made there directly. Other work goes on a branch so it can be reviewed in a pull request and merged after conflicts are resolved, instead of changing the shared branch while the work is still in progress.
