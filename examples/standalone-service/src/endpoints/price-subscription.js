const auth = require('./auth');
const subscriptions = require('./subscriptions');

module.exports = (app) => {
  app.post('/prices/subscribe', auth, (request, response) => {
    const {contextId, referenceId} = request.body;
    if(!subscriptions.exists(contextId, referenceId)){
      subscriptions.create(contextId, referenceId);
      return response.status(200).send({
        snapshot: request.body
      });
    }

    return response.status(409).send(`Conflict: contextId and referenceId combination exists. Please try difference reference id.`);
  });

  app.delete('/prices/unsubscribe/:contextId/:referenceId', auth, (request, response) => {
    const {contextId, referenceId} = request.params;

    if(subscriptions.exists(contextId, referenceId)){
      subscriptions.remove(contextId, referenceId)
      return response.status(200).send();
    }

    return response.status(404).send();
  });

};