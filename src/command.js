const path = require("path");
const jsonDiff = require('json-diff')
const ispec = require("./ispec");
const {searchFiles} = require("./utils/file");

const getSpecFilesWithFilter = async (args, specsPath, rootPath) => {
  const filter = args.find(arg => arg.startsWith("specs="))?.split("=").pop();
  const withRelativePath = (files) => files.map(relative => {
    return {
      relative,
      path: path.resolve(path.join(specsPath, relative))
    };
  });

  const allFiles = await Promise.all([
    searchFiles("**/*.spec.yml", specsPath, rootPath),
    searchFiles("**/*.spec.yaml", specsPath, rootPath)]).then(files => files.flat());

  if(filter){
    const patterns = filter.split(",").map(p => new RegExp(p));
    const filteredFiles = allFiles.filter(file => patterns.find(p => p.test(file)));

    return withRelativePath(filteredFiles);
  }
  return withRelativePath(allFiles);
};

const getVariablesProviders = async (args, runnerPath, rootPath) => {
  const files = await searchFiles("**/*.variable.js", runnerPath, rootPath);
  const paths = files.map(file => path.resolve(path.join(runnerPath, file)));
  const variableProviders = await Promise.all(paths.map(p => require(p)));

  return variableProviders;
};

const getServer = (args) => {
  return args.find(arg => arg.startsWith("server="))?.split("=").pop();
};

const readCommands = async (args) => {
  const rootPath = path.join(process.cwd(), args[0]);
  const specsPath = path.join(rootPath, "specs");
  const runnersPath = path.join(rootPath, "runners");
  const server = getServer(args);
  return {
    server,
    rootPath,
    specsPath,
    runnersPath,
    logReport : process.env.report === 'true',
    specFiles : await getSpecFilesWithFilter(args, specsPath, rootPath),
    variableProviders: await getVariablesProviders(args, runnersPath, rootPath),
  };
}

module.exports = {
  run : async([nodePath, scriptPath, ...args]) => {
    const params = await readCommands(args);
    ispec.setServer(params.server);

    for(const file of params.specFiles){
      await ispec.addSpec(file);
    }

    for(const provider of params.variableProviders){
      await ispec.addVariable(provider);
    }

    await ispec.start();
    const report = await ispec.report();

    if(params.logReport){
      return console.log(`###ispec:report${JSON.stringify(report)}`);
    }

    console.log(`Passed : ${report.passed.length}/${report.passed.length + report.failed.length}`);
    report.failed.forEach((result) => {
      console.error(`Failed : ${result.spec.name}`);
      console.error(jsonDiff.diffString(result.status.expected, result.status.actual));
    });
  }
};