const auth = require('./auth');

module.exports = (app) => {
  app.post('/prices/subscribe', auth, (request, response) => {
    return response.status(200).send({
      snapshot: request.body
    });
  });
};