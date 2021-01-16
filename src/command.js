const path = require("path");
const ispec = require("./ispec");
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
    const params = await readCommands(args);
    await ispec.addSpec(params.specFiles);
    await ispec.start();
    const report = await ispec.report();
    console.log(JSON.stringify(report));
  }
};