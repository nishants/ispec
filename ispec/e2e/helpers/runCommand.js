const {exec} = require('child_process');
const {server}  = require('./defaultParams');

const runCommand = (params) => {
  return new Promise((resolve, reject) => {
    const output = [];
    const errors = [];
    const child = exec(`report=true npm run e2e:test . ${params} ${server}`);
    const shouldPrintConsoleLogs = process.env.show_test_console_logs === 'true'

    const readReport = () => {
      const reportAnchor = "###ispec:report";
      const reportString = output.find(out => out.startsWith("###ispec:report"))?.replace(reportAnchor, "").trim();
      return reportString ? JSON.parse(reportString) : {};
    }

    child.stderr.on('data', function(data) {
      errors.push(data.toString())
      if(shouldPrintConsoleLogs) console.error(data.toString())
    });

    child.stdout.on('data', function(data) {
      output.push(data.toString())
      if(shouldPrintConsoleLogs) console.log(data.toString())
    });

    child.on('close', (code, signal) => {
      const status = {code, signal, error: undefined};
      const result = {status, output, errors, report: readReport()};
      if(code === 1){
        reject(result);
      }
      resolve(result);
    });

    child.on('error', (error) => {
      const status = {error};
      resolve({status, output, errors})
    });
  });
}

module.exports = runCommand;