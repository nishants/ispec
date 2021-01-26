const auth = require("./auth");
const axios = require("axios");
const externalServiceUrl = process.env.external_servce || 'http://localhost:3124/get-data';

module.exports = (app) => {
  app.post('/remote-service', auth, async (request, response) => {

    try{
      const externalResponse = await axios({
        url : externalServiceUrl,
        method: 'POST',
        data: request.body.dataForRemote
      });

      response.status(200).send(externalResponse.data);
    }catch(error){
      response.status(500).send("Failed to get data from remote service.");
    }
  });
};