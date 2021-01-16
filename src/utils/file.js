const glob = require('glob');

const searchFiles = (pattern, cwd, root) => {
  return new Promise((resolve, reject) => {
    const callback = (error, files) => {
      if(error){
        return reject(error);
      }
      resolve(files)
    };

    glob(pattern, {cwd, root}, callback);
  });
};

module.exports = {
  searchFiles
};