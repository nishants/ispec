const jeyson = require('jeyson').create();

const {readYamlFile} = require('../utils/file')
const runners = [];
const defaultRunner = require('./default-runner');

module.exports = {
  add : (name, runner) => {
    runners.push({name, runner});
  },
  run : async (spec, ispec) => {
    const rawSpecData = await readYamlFile(spec.path);
    const specData = jeyson.compile(ispec.variables(), rawSpecData);

    const runner = specData.runner ? runners.find(r => r.name === specData.runner) : defaultRunner;
    return {
      status: await runner.run(specData, ispec),
      spec: specData.spec
    };
  }
};