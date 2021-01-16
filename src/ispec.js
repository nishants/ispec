const runner = require('./runner');

const specFiles = [];
const runners = [];
const report = {
  server: null,
  failed: [],
  passed: [],
};

const variables = {};
let server;

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

module.exports = {
  setServer: (url) => {
    report.server = url;
    server = url;
  },

  addSpec: (filePath) => {
    specFiles.push(filePath);
  },
  addVariable : async (callback) => {
    await callback(runnerIspec);
  },
  start: async () => {
    const results = await Promise.all(specFiles.map(async spec => runner.run(spec, runnerIspec)));
    results.forEach(result => {
      if(result.status.success){
        return report.passed.push(result);
      }
      report.failed.push(result);
    });
  },
  report : () => {
    return report;
  },
}