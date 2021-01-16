const path = require("path");
const {searchFiles} = require("./utils/file");

const readCommands = async (args) => {
  if(args.length === 1){
    const rootPath = path.join(process.cwd(), args.pop());
    const specsPath = path.join(rootPath, "specs");
    const runnersPath = path.join(rootPath, "runners");
    return {
      rootPath,
      specsPath,
      runnersPath,
      specFiles : await Promise.all([
        searchFiles("**/*.spec.yml", specsPath),
        searchFiles("**/*.spec.yaml", specsPath)]).then(files => files.flat())
    };
  }
}

module.exports = {
  run : async([nodePath, scriptPath, ...args]) => {
    console.log("Running for dir ", await readCommands(args));
  }
};