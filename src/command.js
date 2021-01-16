const path = require("path");
const ispec = require("./ispec");
const {searchFiles} = require("./utils/file");

const getSpecFilesWithFilter = async (args, specsPath) => {
  const filter = args.find(arg => arg.startsWith("specs="))?.split("=").pop();
  const allFiles = await Promise.all([
    searchFiles("**/*.spec.yml", specsPath),
    searchFiles("**/*.spec.yaml", specsPath)]).then(files => files.flat());

  if(filter){
    const patterns = filter.split(",").map(p => new RegExp(p));
    return allFiles.filter(file => patterns.find(p => p.test(file)));
  }
  return allFiles
};

const readCommands = async (args) => {
  console.log(args);
  const rootPath = path.join(process.cwd(), args[0]);
  const specsPath = path.join(rootPath, "specs");
  const runnersPath = path.join(rootPath, "runners");
  return {
    rootPath,
    specsPath,
    runnersPath,
    logReport : process.env.report === 'true',
    specFiles : await getSpecFilesWithFilter(args, specsPath)
  };
}

module.exports = {
  run : async([nodePath, scriptPath, ...args]) => {
    const params = await readCommands(args);

    for(const file of params.specFiles){
      await ispec.addSpec(file);
    }

    await ispec.start();
    if(params.logReport){
      const report = await ispec.report();
      console.log(`###ispec:report${JSON.stringify(report)}`);
    }
  }
};