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
    const results = await Promise.all(specFiles.map(async spec => {
      return {
        spec,
        result: await runner.run(spec, runnerIspec)
      }
    }));
    results.forEach(item => {
      if(item.result.success){
        return report.passed.push(item.spec.relative);
      }
      report.failed.push(item.spec.relative);
    });
  },
  report : () => {
    return report;
  },
}