const runParam  = require('./helpers/runCommand');

test("should run a single file in a project", async () => {
  const {report} = await runParam("auth-sucess.spec.yml");
  const expectedReport = {
    "failed":  [],
    "passed":  [],
    "runners": [],
    "specFiles": [
      "auth-missing-token.spec.yml",
      "auth-sucess.spec.yml"
    ]
  }
  expect(report).toEqual(expectedReport);
});