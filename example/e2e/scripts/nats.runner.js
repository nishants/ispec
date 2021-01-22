const NATS = require("nats");

module.exports = async (ispec) => {
  const natsUrl = process.env.nats_endpoint || 'localhost:4222';
  const nats = NATS.connect(natsUrl, {json:true});
  console.log("Runner connected to NATS at : ", natsUrl);
  const suscriptionIds = [];
  const expectedMessages = {};

  const runner = {
    appliesTo: (specAsJson) => {
      return specAsJson.hasOwnProperty('nats');
    },

    beforeSpec: async (specAsJson, ispec, expect) => {
      for(const {topic, reply, expectedMessage} of specAsJson.nats.given){
        const id = nats.subscribe(topic, (message, replyTo) => {
          nats.publish(replyTo, reply);
        });
        suscriptionIds.push(id);
      }

      for(const {topic, messages, reply} of specAsJson.nats.expect){
        expectedMessages[topic] = {expected: messages, actual : []};
        const id = nats.subscribe(topic, (actualMessage, replyTo) => {
          expectedMessages[topic].actual.push(actualMessage);
        });
        suscriptionIds.push(id);
      }

      // ensure nats subscription is ready before proceeding
      await new Promise((resolve) => {
        nats.subscribe('__nats-runner.wait-till-ready', resolve);
        nats.publish('__nats-runner.wait-till-ready');
      });
    },

    afterSpec: async (specAsJson, expect) => {
      suscriptionIds.forEach(id => nats.unsubscribe(id));
      nats.close();
      Object.keys(expectedMessages).forEach((topic) => {
        expect({
          message: `Subject on nats : ${topic}`,
          actual : expectedMessages[topic].actual,
          expected : expectedMessages[topic].expected,
        });
      });
    }
  };

  ispec.addRunner('name', runner);
};