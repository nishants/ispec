const {exec} = require('child_process');

const runCommand = (params) => {
  return new Promise((resolve) => {
    const output = [];
    const errors = [];
    const child = exec(`report=true npm run e2e:test . ${params}`);

    const readReport = () => {
      const reportAnchor = "###ispec:report";
      const reportString = output.find(out => out.startsWith("###ispec:report"))?.replace(reportAnchor, "").trim();
      return reportString ? JSON.parse(reportString) : {};
    }

    child.stderr.on('data', function(data) {
      errors.push(data.toString());
    });

    child.stdout.on('data', function(data) {
      output.push(data.toString());
    });

    child.on('close', (code, signal) => {
      const status = {code, signal, error: undefined};
      const result = {status, output, errors, report: readReport()};
      resolve(result);
    });

    child.on('error', (error) => {
      const status = {error};
      resolve({status, output, errors})
    });
  });
}

module.exports = runCommand;