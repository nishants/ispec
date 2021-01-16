const {exec} = require('child_process');

const runCommand = (command) => {
  return new Promise((resolve) => {
    const output = [];
    const errors = [];
    const child = exec(command);

    child.stderr.on('data', function(data) {
      errors.push(data.toString());
    });

    child.stdout.on('data', function(data) {
      output.push(data.toString());
    });

    child.on('close', (code, signal) => {
      const status = {code, signal, error: undefined};
      const result = {status, output, errors};
      resolve(result);
    });

    child.on('error', (error) => {
      const status = {error};
      resolve({status, output, errors})
    });
  });
}

module.exports = runCommand;