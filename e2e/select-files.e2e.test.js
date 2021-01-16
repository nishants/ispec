const runParam  = require('./helpers/runCommand');

describe("Select files to run", () => {

  test("should filter file using specs=pattern", async () => {
    const {report} = await runParam("specs=auth-success");
    const expected = [
      "specs/auth-success.spec.yml"
    ];
    expect(report.specFiles).toEqual(expected);
  });

  test("should run all files if not filtered", async () => {
    const {report} = await runParam("");
    const expectedFiles = [
      "specs/auth-success.spec.yml",
      "specs/auth-missing-token.spec.yml"
    ];
    expect(report.specFiles.sort()).toEqual(expectedFiles.sort());
  });

  test("should support multiple filters", async () => {
    const {report} = await runParam("specs=auth-success.spec.yml,auth-missing-token");
    const expectedFiles = [
      "specs/auth-success.spec.yml",
      "specs/auth-missing-token.spec.yml"
    ];
    expect(report.specFiles.sort()).toEqual(expectedFiles.sort());
  });

  test("should run multiple files that  match filter", async () => {
    const {report} = await runParam("specs=auth");
    const expectedFiles = [
      "specs/auth-success.spec.yml",
      "specs/auth-missing-token.spec.yml"
    ];
    expect(report.specFiles.sort()).toEqual(expectedFiles.sort());
  });

});