const runner = require('./runner');

const specFiles = [];
const runners = [];
const report = {
  server: null,
  failed: [],
  passed: [],
};

let server;

const runnerIspec = {
  getUrl : (url) => {
    return new URL(url, server).href;
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
  addRunner : (name, runner) => {
    runners.push(name);
  },
  start: async () => {
    const results = await Promise.all(specFiles.map(async spec => runner.run(spec, runnerIspec)));
    results.forEach(result => {
      if(result.status.success){
        return report.passed.push(result.spec);
      }
      report.failed.push(result.spec);
    });
  },
  report : () => {
    return report;
  },
}