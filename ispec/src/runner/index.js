const mustache = require('mustache');
const {readYamlFile} = require('../utils/file');
const defaultRunner = require('./default-runner');
const util = require('util');

module.exports = {
  run : async (spec, ispec, runners) => {
    const specTemplate = await readYamlFile(spec.path);
    const specAsJson = JSON.parse(mustache.render(JSON.stringify(specTemplate), ispec.variables()));
    const appliedRunners = runners.filter(r => r.appliesTo(specAsJson));

    const runnerAssertionFailures = [];

    const runnerExpect = (assertion) => {
      const status = util.isDeepStrictEqual(assertion.expected, assertion.actual);
      if(!status){
        runnerAssertionFailures.push({
          message: assertion.message,
          expected: assertion.expected,
          actual: assertion.actual,
        });
      }
    };

    const combineRunnerStatus = (defaultStatus) => {
      const result = {
        success: defaultStatus.success && runnerAssertionFailures.length === 0,
        expected : {...defaultStatus.expected},
        actual : {...defaultStatus.actual}
      };

      for(const failure of runnerAssertionFailures){
        result.expected[failure.message] = failure.expected;
        result.actual[failure.message] = failure.actual;
      }

      return result;
    };

    const runnerBefore = async () => {

      for(const runner of appliedRunners){
        await runner.beforeSpec(specAsJson, ispec, runnerExpect);
      }
    };

    const runnerAfter = async () => {
      for(const runner of appliedRunners){
        await runner.afterSpec(specAsJson, runnerExpect);
      }
    };

    await runnerBefore();

    // run before blocks
    const beforeBlocks = specAsJson.before || [];
    for(const beforeBlock of beforeBlocks){
      const status = await defaultRunner.run(beforeBlock, ispec);
      if(!status.success){
        return {
          path: spec.relative,
          status: combineRunnerStatus(status),
          spec: beforeBlock.spec
        };
      }
    }

    const status = await defaultRunner.run(specAsJson, ispec);

    // run after blocks
    if(status.success){
      const afterBlocks = specAsJson.after || [];
      for(const afterBlock of afterBlocks){
        const status = await defaultRunner.run(afterBlock, ispec);
        if(!status.success){
          return {
            path: spec.relative,
            status: combineRunnerStatus(status),
            spec: afterBlock.spec
          };
        }
      }
    }

    await runnerAfter();

    return {
      status: combineRunnerStatus(status),
      spec: specAsJson.spec,
      path: spec.relative
    };
  }
};