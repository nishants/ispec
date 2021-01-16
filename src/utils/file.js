const glob = require('glob');

const searchFiles = (pattern, cwd) => {
  return new Promise((resolve, reject) => {
    const callback = (error, files) => {
      if(error){
        return reject(error);
      }
      resolve(files)
    };

    glob(pattern, {cwd}, callback);
  });
};

module.exports = {
  searchFiles
};