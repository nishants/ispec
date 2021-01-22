const NATS = require("nats");
const nats = NATS.connect('localhost:4222', {json:true});

const createServer = (serverName) => {
  nats.subscribe(`search.find-session.${serverName}.>`, (message, replyTo) => {
    return nats.publish(replyTo, serverName);
  });

  nats.subscribe(`server.${serverName}`, (message) => {
    console.log(`${serverName} served ${message}`);
  });

  nats.subscribe(`server.list`, (message, replyTo) => {
    return nats.publish(replyTo, serverName);
  });


  nats.subscribe(`server.ping.${serverName}`, (message, replyTo) => {
    return nats.publish(replyTo, {serverName, healthy: true});
  });

  console.log(`Started external streaming server : ${serverName}`)
};

module.exports = {createServer}