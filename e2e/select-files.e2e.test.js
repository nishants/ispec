const runParam  = require('./helpers/runCommand');
const readResult  = require('./helpers/readResult');

describe("Select files to run", () => {

  test("should filter file using specs=pattern", async () => {
    const {report} = await runParam("specs=auth-success");
    const expected = {passed: ["Must return data if token is present"]};
    const actual = readResult(report);
    expect(actual).toEqual(expected);
  });

  test("should run all files if not filtered", async () => {
    const {report} = await runParam("");
    const expectedFiles = [
      "Must return 403 if request does not have token in header",
      "Must return data if token is present",
      "Variables and templates"
    ];
    const actual = readResult(report);
    expect(actual.passed.sort()).toEqual(expectedFiles);
  });

  test("should support multiple filters", async () => {
    const {report} = await runParam("specs=auth-success.spec.yml,auth-missing-token");
    const expectedFiles = [
      "Must return 403 if request does not have token in header",
      "Must return data if token is present"
    ];
    const actual = readResult(report);
    expect(actual.passed.sort()).toEqual(expectedFiles);
  });

  test("should run multiple files that  match filter", async () => {
    const {report} = await runParam("specs=auth");
    const expectedFiles = [
      "Must return 403 if request does not have token in header",
      "Must return data if token is present"
    ];
    const actual = readResult(report);
    expect(actual.passed.sort()).toEqual(expectedFiles);  });
});