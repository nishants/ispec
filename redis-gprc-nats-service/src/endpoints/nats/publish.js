const auth = require("../auth");
const natsClient = require("./nats-client");

module.exports = (app) => {
  app.post('/nats/publish', auth, async (request, response) => {
    const {sessionId, message} = request.body;
    const responseBody = await natsClient.sendMessage(sessionId, message);
    response.status(200).send(responseBody);
  });
};