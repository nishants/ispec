const {exec} = require('child_process');

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    const output = [];
    const child = exec(command);

    child.stdout.on('data', function(data) {
      output.push(data.toString());
    });

    child.on('close', (code, signal) => {
      const status = {code, signal, error: undefined};
      resolve({status, output});
    });

    child.on('error', (error) => {
      const status = {error};
      reject({status, output})
    });
  });
}

(async () => {
  const result = await runCommand('npm run e2e:tests');
  if(result.code === 0){
    console.log("SUCCESS : ", {result});
  }
  console.error("ERROR : ", {result});
})();