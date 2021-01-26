const express = require('express');

module.exports = async () => {
  const port = process.env.external_service_port || 3124;
  const receivedMessages = [];
  let server;

  const appliesTo = (specAsJson) => {
    return specAsJson.hasOwnProperty('externalService');
  }

  const beforeSpec = async (specAsJson) => {
    const serverName = specAsJson.externalService.serverName;
    const app = express();
    app.use(express.json());
    app.post('/get-data', (request, response) => {
      receivedMessages.push(request.body.message);
      response.send({fromStub: {dataReceived: request.body}, serverName });
    });
    await new Promise(resolve => {
      server = app.listen(port, resolve);
    });
    console.log("Stub server started on port ", port);
  };

  const afterSpec = (specAsJson, expect) => {
    server.close();
    const expected = specAsJson.externalService.expectedMessages;
    expect({
      message: `externalData.expectedMessages`,
      actual : receivedMessages,
      expected,
    });
  };

  return {
    appliesTo,
    beforeSpec,
    afterSpec
  };
};
