const runner = require('./runner');

const specFiles = [];
const report = {
  failed: [],
  passed: [],
};

const variables = {};
const runnerFactories = [];

let server;

process.on('unhandledRejection', up => { throw up })

process.on('uncaughtException', (error) => {
  console.log(error);
  process.exit(1);
});

const runnerIspec = {
  getUrl : (url) => {
    return new URL(url, server).href;
  },
  variables: ()=> variables,
  addVariable: (vars) => {
    Object.keys(vars).forEach(key => {
      variables[key] = vars[key];
    });
  }
};

const runSpec = async (spec, runnerIspec, runners) => {
  // before and after blocks run with same runner instance
  return runner.run(spec, runnerIspec, runners);
};

const start = async () => {
  const results = [];
  // Create new runner for every test run
  for(const spec of specFiles){
    const runners = [];
    for(const runnerFactory of runnerFactories){
      const runner = await runnerFactory(runnerIspec);
      runners.push(runner);
    }
    results.push(await runSpec(spec, runnerIspec, runners));
  }

  results.forEach(result => {
    if(result.status.success){
      return report.passed.push(result);
    }
    report.failed.push(result);
  });
};

const iSpec = {
  setServer: (url) => {
    server = url;
    report.server = url;
  },

  addSpec: (filePath) => {
    specFiles.push(filePath);
  },
  addVariable : async (callback) => {
    await callback(runnerIspec);
  },
  addRunner : async (runnerFactory) => {
    runnerFactories.push(runnerFactory);
  },
  start: start,
  report : () => {
    return report;
  },
};

module.exports = iSpec