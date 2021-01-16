const {readYamlFile} = require('../utils/file')
const runners = [];
const defaultRunner = require('./default-runner');

module.exports = {
  add : (name, runner) => {
    runners.push({name, runner});
  },
  run : async (spec, ispec) => {
    const specData = await readYamlFile(spec.path);
    const runner = specData.runner ? runners.find(r => r.name === specData.runner) : defaultRunner;
    return {
      status: await runner.run(specData, ispec),
      spec: specData.spec
    };
  }
};