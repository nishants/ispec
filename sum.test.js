const expect = require('chai').expect;

const specs = [
  {feature : "test-1", scenario: "test-1/one", expected: {tree: {branchOne: {name : "one", values: [3,4, 1]}}} ,actual: {tree: {branchOne: {name : "one", values: [3,3, 1]}}}},
  {feature : "test-1", scenario: "test-1/two", expected: false ,actual: false},
  {feature : "test-2", scenario: "test-2/one", expected: false,actual: false},
  {feature : "test-3", scenario: "test-3/one", expected: false ,actual: false},
]

const runSpec = async (spec) => {
  expect(spec.actual).to.equal(spec.expected);
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
        console.log(failures);
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
      failures.push({spec, error: {expected, actual, message}})
      finished(spec, e);
    }
  }
}

runTests();