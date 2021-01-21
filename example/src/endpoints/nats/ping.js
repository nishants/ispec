const natsClient = require("./nats-client");

module.exports = (app) => {
  app.get('/nats/ping', async (request, response) => {
    const serverName = request.query.server;
    try{
      const responseBody = await natsClient.pingServer(serverName);
      response.status(200).send(responseBody);
    }catch(e){
      response.status(500).send("Could not find server");
    }
  });
};