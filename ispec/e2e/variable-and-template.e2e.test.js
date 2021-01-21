const runParam  = require('./helpers/runCommand');
const readResult  = require('./helpers/readResult');

describe("Should support variables and templates", () => {
  test("should add value to templates from variables", async () => {
    const {report} = await runParam(`specs=template-token.spec.yml`);
    const actual = readResult(report);
    const actualServer = report.server;
    const expected = {passed: ["Use dynamic token"]};
    expect(actual).toEqual(expected);
  });
});