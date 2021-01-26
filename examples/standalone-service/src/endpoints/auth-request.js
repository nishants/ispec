const auth = require("./auth");

module.exports = (app) => {
  app.post('/auth', auth, (request, response) => {

    response.status(200).send({
      requestUrl: request.url,
      requestMethod: request.method,
      success: true,
      requestHeaders: request.headers,
      requestBody: request.body,
    });
  });
};