const runParam  = require('./helpers/runCommand');
const readResult  = require('./helpers/readResult');

describe("Runners", () => {

  test("should setup runner", async () => {
    const {report} = await runParam("specs=nats-ping.spec.yml");
    const expected = {passed: ["Get data from a nats server"]};
    const actual = readResult(report);
    expect(actual).toEqual(expected);
  });

});