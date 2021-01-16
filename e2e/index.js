const {exec} = require('child_process');

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
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

      if(errors.length){
        return reject(result);
      }

      resolve(result);
    });

    child.on('error', (error) => {
      const status = {error};
      reject({status, output, errors})
    });
  });
}

(async () => {
  try{
    const result = await runCommand('npm run e2e:tests');
    console.log(result);
  }catch(e){
    console.error(e);
  }
})();