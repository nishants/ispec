const NATS = require('nats');
const nats = NATS.connect(process.env.nats_address || 'localhost:4222');

module.exports = () => {

  const findStreamingServer = (sessionId, contextId) => {
    return new Promise((resolve, reject) => {
      const request = JSON.stringify({sessionId, contextId});
      const options = { max: 1, timeout: 1000 };

      nats.request('findStreamingServer', request, options, (response) => {
        if (response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
          reject(null);
        } else {
          resolve(response);
        }
      });
    });
  };

  const updates = [
    {one: 1,two: 2, three: 3},
    {one: 1,two: 22, three: 3},
    {one: 1,two: 22, three: 33} ,
    {one: 11,two: 22, three: 3}
  ];

  const deltaCalculator = () => {
    let previous = {};
    const getDelta = (base, data) => {
      const delta = {};
      for(const key in data){
        if(data.hasOwnProperty(key) && base[key] !== data[key]){
          delta[key] = data[key];
        }
      }
      return delta;
    }
    return (data) => {
      const delta = getDelta(previous, data);
      previous = data;
      return delta;
    }
  };

  const startSubscription = async (sessionId, contextId, referenceId) => {
    const server = await findStreamingServer(sessionId, contextId);
    const getDelta = deltaCalculator();
    updates.forEach((update) => {
      setTimeout(() => {
        nats.publish(server, JSON.stringify(getDelta(update)));
      }, 100);
    });
  }

  const stopSubscription = (sessionId, contextId, referenceId) => {
    nats.close();
  };

  return {
    startSubscription,
    stopSubscription
  }
};
