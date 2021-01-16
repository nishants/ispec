

module.exports = (app) => {
  app.post('/auth', (request, response) => {
    const bearerToken = request.headers.authorization?.toUpperCase().split("Bearer ").pop();

    if(!bearerToken){
      return response.status(403).send("Expected header {Authorization: Bearer <token>}");
    }
    response.status(200).send({
      requestUrl: request.url,
      requestMethod: request.method,
      success: true,
      requestHeaders: request.headers,
      requestBody: request.body,
    });
  });
}


/*
Authorization: Bearer eyJhbGciOiJFUzI1NiIsIng1dCI6IkIzMDEwMjJENEQzRjUwRjE3NUQ5NERBNjNFRjU3MTA1NDIwNDI4OTUifQ.eyJvYWEiOiIwMDAwMCIsImlzcyI6Im9hIiwiYWlkIjoiNDE3IiwidWlkIjoiMFhVRGRscTFCWFRianNIbHN4SmhCZz09IiwiY2lkIjoiQVdtVlB3QkFuRjJJM1h1bFFEcjJjUT09IiwiaXNhIjoiVHJ1ZSIsInRpZCI6IjEwMTAiLCJzaWQiOiI1ODMwMTIxZmQyYjE0M2Q5ODJmMzE2MTg4ZDZmNDQyOCIsImRnaSI6IjgyIiwiZXhwIjoiMTYwNzc1ODgxMCJ9.mUwt5Qa6Mwb2FeByV4JoxclFuYhCF7pnapimfyr3UWh45_y_ZKKugxFJJxdApW_zYYZPoU2HSn7DK5YgEDHacw
* */