const expect = require('chai').expect;

const specs = [
  {feature : "test-1", scenario: "test-1/one", expected: {tree: {branchOne: {name : "one", values: [3,4, 1]}}} ,actual: {tree: {branchOne: {name : "one", values: [3,3, 1]}}}},
  {feature : "test-1", scenario: "test-1/two", expected: {tree: {branchOne: {name : "one", values: [3,4, 1]}}} ,actual: {tree: {branchOne: {name : "one", values: [3,4, 1]}}}},
  {feature : "test-2", scenario: "test-2/one", expected: "hello" ,actual: "hi"},
  {feature : "test-3", scenario: "test-3/one", expected: "hello" ,actual: "hello"},
]

const runSpec = async (spec) => {
  expect(spec.actual).to.deep.equal(spec.expected);
};

const runTests = async () => {
  let totalTests = 0;
  const failures = [];
  const finished = async (spec, error) => {
    totalTests++;
    if(totalTests === specs.length){
      console.log("Finished.....")
      console.log(`Result : Passed ${specs.length - failures.length}/${specs.length}`)
      if(failures.length){
        failures.forEach(failure => {
          let output = {
            feature: failure.spec.feature,
            scenario: failure.spec.scenario,
            expected: JSON.stringify(failure.expected),
            actual: JSON.stringify(failure.actual),
            diff: failure.message,
          };
          console.log(output);
        });

        console.error(`Failed : ${failures.length}/${specs.length}`)
      }
    }
  };

  for (const spec of specs) {
    try{
      await runSpec(spec);
      finished(spec);
    }catch(e){
      const {expected, actual, message} = e;
      failures.push({spec,...{expected, actual, message}})
      finished(spec, e);
    }
  }
}

runTests();