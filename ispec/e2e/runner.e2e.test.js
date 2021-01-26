const runParam  = require('./helpers/runCommand');
const readResult  = require('./helpers/readResult');

describe("Stub", () => {

  test("should support stubs", async () => {
    const {report} = await runParam("specs=stub.example.spec.yml");
    const expected = {passed: ["Should support stubs"]};
    const actual = readResult(report);
    expect(actual).toEqual(expected);
  });

});