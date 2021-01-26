const NATS = require("nats");

module.exports = async (ispec) => {
  const natsUrl = process.env.nats_endpoint || 'localhost:4222';
  let nats;
  const expectedMessages = {};

  const appliesTo = (specAsJson) => {
    return specAsJson.hasOwnProperty('nats');
  };

  const beforeSpec = async (specAsJson, ispec, expect) => {
    nats = NATS.connect(natsUrl, {json:true})
    console.log("waiting for nats connection...", natsUrl);

    await new Promise(resolve => nats.on('connect', resolve));

    for(const {topic, reply, expectedMessage} of specAsJson.nats.given){
      nats.subscribe(topic, (message, replyTo) => {
        nats.publish(replyTo, reply);
      })
    }

    if(specAsJson.nats.hasOwnProperty('expect')){
      for(const {topic, messages, reply} of specAsJson.nats.expect){
        expectedMessages[topic] = {expected: messages, actual : []};

        nats.subscribe(topic, (actualMessage, replyTo) => {
          expectedMessages[topic].actual.push(actualMessage);
        });
      }
    }

    // Wait for duration to complete one round trip
    // with nats serve. This ensures nats subscription will receive
    // the first published event from client
    await new Promise(resolve => nats.flush(resolve));
  };

  const afterSpec = async (specAsJson, expect) => {
    // Make sure thread is blocked for enough time to complete
    // a round trip to nats server. This ensure there is enough time
    // for service's events to reach the subscriptions setup in before
    // block above
    return new Promise(async (resolve) => {
      console.log("closing...")
      // Drain to make sure we received all messages from service
      nats.drain(async (error) => {
        Object.keys(expectedMessages).forEach((topic) => {
          expect({
            message: `nats:${topic}`,
            actual : expectedMessages[topic].actual,
            expected : expectedMessages[topic].expected,
          });
        });
        if(error){
          console.error(error);
        }
        console.log("closed nats connection");
        nats.close();
        resolve();
      });
    });
  };

  return {
    appliesTo,
    beforeSpec,
    afterSpec
  };
};