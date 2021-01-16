const specFiles = [];
const runners = [];

const report = {
  failed: [],
  passed: [],
};

module.exports = {
  addSpec: (filePath) => {
    specFiles.push(filePath);
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