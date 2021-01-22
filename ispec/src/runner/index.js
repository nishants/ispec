const mustache = require('mustache');

const {readYamlFile} = require('../utils/file')
const runners = [];
const defaultRunner = require('./default-runner');

module.exports = {
  add : (name, runner) => {
    runners.push(runner);
  },
  run : async (spec, ispec) => {
    const specTemplate = await readYamlFile(spec.path);
    const specAsJson = JSON.parse(mustache.render(JSON.stringify(specTemplate), ispec.variables()));
    const appliedRunners = runners.filter(r => r.appliesTo(specAsJson));

    const runnerExpect = () => {
      console.log("Yeah.. expected from runner")
    };
    const before = async () => {

      for(const runner of appliedRunners){
        await runner.beforeSpec(specAsJson);
      }
    };

    const after = async () => {
      for(const runner of appliedRunners){
        await runner.afterSpec(specAsJson, runnerExpect);
      }
    };

    await before();
    const status = await defaultRunner.run(specAsJson, ispec);
    await after();

    return {
      status: status,
      spec: specAsJson.spec
    };
  }
};