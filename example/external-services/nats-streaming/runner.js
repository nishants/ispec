const server = require('./server')();
const client = require('./client')();

server.start();
client.startSubscription("session-1", "context-2", "reference-3");

setTimeout(() => {
  client.stopSubscription("session-1", "context-2", "reference-3");
  const actual = server.getMessages();
  console.log(actual);
}, 5000);