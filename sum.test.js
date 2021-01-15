
const specs = [
  {group : "test-1", name: "test-1/one", value: true},
  {group : "test-1", name: "test-1/two", value: false},
  {group : "test-2", name: "test-2/one", value: true},
  {group : "test-3", name: "test-3/one", value: false},
]

const runSpec = async (spec) => {
  expect(spec.value).toBe(true);
};

const runTests = async () => {
  let totalTests = 0;
  const failures = [];
  const finished = async (spec) => {
    totalTests++;
    if(totalTests === specs.length){
      console.log("Finished.....")
      console.log(`Result : Passed ${specs.length - failures.length}/${specs.length}`)
      if(failures.length){
        console.log(failures);
        console.error(`Failed : ${failures.length}`)
      }
    }
  };

  specs.forEach(spec => {
    test(spec.name, async () => {
      try{
        await runSpec(spec);
        finished(spec);
      }catch(e){
        failures.push({spec, result: e})
        finished(spec);
      }
    });
  });
}

runTests();