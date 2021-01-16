const fs = require('fs');
const glob = require('glob');
const yaml = require('yaml');

const readTextFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, {encoding: 'utf-8'}, (error,data) => {
      if (error) {
        return reject(error)
      }
      resolve(data);
    });
  });
};

const readYamlFile = (filePath) => {
  return readTextFile(filePath).then(data => yaml.parse(data));
};


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
  searchFiles,
  readYamlFile
};