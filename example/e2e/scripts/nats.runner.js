const NATS = require("nats");

module.exports = async (ispec) => {
  const natsUrl = process.env.nats_endpoint || 'localhost:4222';
  const nats = NATS.connect(natsUrl, {json:true});
  console.log("Runner connected to NATS at : ", natsUrl);
  const suscriptionIds = [];

  const runner = {
    appliesTo: (specAsJson) => {
      return specAsJson.hasOwnProperty('nats');
    },

    beforeSpec: async (specAsJson, ispec) => {
      for(const {topic, reply, expectedMessage} of specAsJson.nats.given){

        const id = nats.subscribe(topic, (message, replyTo) => {
          nats.publish(replyTo, reply);
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
      return expect([
          {
            expected: {value: [1, 2 ,3]},
            actual: {value: [1, 2 , 3, 4]},
            messasge : "runner should be able to assert"
          }
        ]
      );
    }
  };

  ispec.addRunner('name', runner);
};