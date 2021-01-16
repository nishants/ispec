const runParam  = require('./helpers/runCommand');

describe("Select files to run", () => {

  test("should filter file using specs=pattern", async () => {
    const {report} = await runParam("specs=auth-success");
    const expected = [
      "auth-success.spec.yml"
    ];
    expect(report.passed).toEqual(expected);
  });

  test("should run all files if not filtered", async () => {
    const {report} = await runParam("");
    const expectedFiles = [
      "auth-missing-token.spec.yml",
      "auth-success.spec.yml"
    ];
    expect(report.passed.sort()).toEqual(expectedFiles);
  });

  test("should support multiple filters", async () => {
    const {report} = await runParam("specs=auth-success.spec.yml,auth-missing-token");
    const expectedFiles = [
      "auth-missing-token.spec.yml",
      "auth-success.spec.yml"
    ];
    expect(report.passed.sort()).toEqual(expectedFiles);
  });

  test("should run multiple files that  match filter", async () => {
    const {report} = await runParam("specs=auth");
    const expectedFiles = [
      "auth-missing-token.spec.yml",
      "auth-success.spec.yml"
    ];
    expect(report.passed.sort()).toEqual(expectedFiles);
  });
});