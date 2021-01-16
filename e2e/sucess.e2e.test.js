const runParam  = require('./helpers/runCommand');

test("should filter file using specs=pattern", async () => {
  const {report} = await runParam("specs=auth-sucess.spec.yml");
  const expected = [
    "auth-sucess.spec.yml"
  ];
  expect(report.specFiles).toEqual(expected);
});

test("should run all files if not filtered", async () => {
  const {report} = await runParam("");
  const expectedFiles = [
    "auth-sucess.spec.yml",
    "auth-missing-token.spec.yml"
  ]
  expect(report.specFiles.sort()).toEqual(expectedFiles.sort());
});