const nats = require('nats').connect(process.env.nats_address || 'localhost:4222')

module.exports = () => {
  const unknownMessages = [];
  const updates = [];
  const findSessionMessage = "{\"sessionId\":\"session-1\",\"contextId\":\"context-2\"}";
  const streamingServerId = "server-id-1";
  const publisherMessage = streamingServerId;

  const discoveryMessage = "";
  let subscriptionId;

  const start = () => {
    subscriptionId = nats.subscribe("*", (message, replyTo) => {
      if(message === findSessionMessage){
        return nats.publish(replyTo, streamingServerId);
      }
      if(message === publisherMessage){
        return updates.push(message);
      }
      // Make sure there are no unknown messages here
      unknownMessages.push(message);
    });
  };
  return {
    start,
    getMessages: () => {
      return {
        unknownMessages,
        updates
      };
    },
    reset: () => {
      nats.unsubscribe(subscriptionId);
    }
  }

};

// const streamingService = start();
// setTimeout(() => {
//   console.log(streamingService.stop())
// }, 3000);
