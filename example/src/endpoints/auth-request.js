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
};