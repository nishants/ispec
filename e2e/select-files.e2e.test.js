const runParam  = require('./helpers/runCommand');

describe("specs=pattern1,pattern2", () => {

  test("should filter file using specs=pattern", async () => {
    const {report} = await runParam("specs=auth-sucess.spec.yml");
    const expected = [
      "specs/auth-sucess.spec.yml"
    ];
    expect(report.specFiles).toEqual(expected);
  });

  test("should run all files if not filtered", async () => {
    const {report} = await runParam("");
    const expectedFiles = [
      "specs/auth-sucess.spec.yml",
      "specs/auth-missing-token.spec.yml"
    ];
    expect(report.specFiles.sort()).toEqual(expectedFiles.sort());
  });

  test("should support mulitple filters", async () => {
    const {report} = await runParam("specs=auth-sucess.spec.yml,auth-missing-token");
    const expectedFiles = [
      "specs/auth-sucess.spec.yml",
      "specs/auth-missing-token.spec.yml"
    ];
    expect(report.specFiles.sort()).toEqual(expectedFiles.sort());
  });

});