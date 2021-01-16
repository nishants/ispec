const specFiles = [];
const runners = [];
const report = {
  server: null,
  failed: [],
  passed: [],
};

module.exports = {
  setServer: (server) => {
    report.server = server;
  },
  addSpec: (filePath) => {
    specFiles.push(filePath);
    report.passed.push(filePath);
  },
  addRunner : (name, runner) => {
    runners.push(name);
  },
  start: () => {
    report.runners = runners;
    report.specFiles = specFiles;
  },
  report : () => {
    return report;
  },
}