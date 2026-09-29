Question                                   Your answer
Method                                     GET
Status code                                200 OK
Content-Type response header               application/json; charset=utf-8
What is in the body?                    {
                                            "userId": 1,
                                            "id": 1,
                                            "title": "delectus aut autem",
                                            "completed": false
                                        }

4. The status code is 404 Not Found, which is in the 4xx family, meaning a client error: the server understood the request but the requested resource does not exist.

5. URL: https://jsonplaceholder.typicode.com/todos/99999
   Scheme: https
   Host: jsonplaceholder.typicode.com
   Path: /todos/99999

6. Query string: userId=1. It filters the todos so that only todos belonging to the user whose id is 1 are returned.

7. A GET request asks the server only to retrieve a resource. A POST request asks the server to accept the data in the request body and do something with it, such as create a resource or process a form submission (a search, login, or comment).

8. This response looks safe for a browser to cache because its Cache-Control header is max-age=43200, which allows the response to be stored and reused for 43200 seconds. That header does not include no-store or no-cache, so nothing in Cache-Control forbids caching it. 
