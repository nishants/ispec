const tokens = require("./token-db");

module.exports = (app) => {
  app.get('/get-token', async (request, response) => {
    const {user,access} = request.query;
    const token = await tokens.getFor({user,access})
    response.status(200).send({token});
  });
};