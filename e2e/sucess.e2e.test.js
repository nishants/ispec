const runComand  = require('./helpers/runCommand');

test("should run a single file in a project", async () => {
  const actual = await runComand("npm run e2e:test")
  expect(actual).toMatchSnapshot();
});