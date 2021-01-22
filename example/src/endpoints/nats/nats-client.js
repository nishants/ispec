const NATS = require("nats");
const natsUrl = process.env.nats_endpoint || 'localhost:4222';
const nats = NATS.connect(natsUrl, {json:true});

const sendMessage = (sessionId, message) => {
  nats.request(`search.find-session.${sessionId}`, {sessionId, message},(serverName) => {
    nats.publish(`server.${serverName}`, message);
  });
};

const pingServer = (serverName, timeout = 100) => {
  return new Promise((resolve, reject) => {
    nats.request(`server.ping.${serverName}`, '',(response) => {
      resolve(response);
    });
    setTimeout(reject, timeout);
  });
};

module.exports = {sendMessage, pingServer};