module.exports = async (ispec) => {
  console.log("nats runner initiated.");

  const runner = {
    appliesTo: (specAsJson) => {
      return specAsJson.hasOwnProperty('nats');
    },

    beforeSpec: (specAsJson, ispec) => {
      console.log("setting up nats");
    },

    afterSpec: (specAsJson, expect) => {
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