
const specs = [
  {group : "test-1", name: "test-1/one", value: true},
  {group : "test-1", name: "test-1/two", value: false},
  {group : "test-2", name: "test-2/one", value: true},
  {group : "test-3", name: "test-3/one", value: false},
]

const runTests = async () => {
  specs.forEach(spec => {
    test(spec.name, async () => {
      expect(spec.value).toBe(true);
    });
  });


}

runTests();