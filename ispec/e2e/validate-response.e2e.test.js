const runParam  = require('./helpers/runCommand');

describe("Should run spec and match response", () => {
  test("should validate when server return non 200 code", async () => {
    const {report} = await runParam(`specs=auth-missing-token.spec.yml`);
    const actual = report.passed;
    const actualServer = report.server;
    const expected = [{
        "path": "auth/auth-missing-token.spec.yml",
      spec: {name: "Must return 403 if request does not have token in header"},
      status: {actual: {}, expected: {}, success: true}
    }];
    expect(actual).toEqual(expected);
    expect(actualServer).toEqual("http://localhost:3123");
  });
});