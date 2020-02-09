const expect = require("chai").expect;
const compareRules = require("../../../src/report/utl/compareRules");

describe("report/dot/compareRules", () => {
  it("samesies yield 0", () => {
    expect(
      compareRules(
        { severity: "error", name: "thing" },
        { severity: "error", name: "thing" }
      )
    ).to.equal(0);
  });

  it("unknown severity > error", () => {
    expect(
      compareRules(
        { severity: "not defined", name: "thing" },
        { severity: "error", name: "thing" }
      )
    ).to.equal(-1);
  });

  it("same name, different severity sorts on severity", () => {
    expect(
      compareRules(
        { severity: "info", name: "thing" },
        { severity: "warn", name: "thing" }
      )
    ).to.equal(1);
  });

  it("differnt name, different severity sorts on severity", () => {
    expect(
      compareRules(
        { severity: "info", name: "aaa" },
        { severity: "warn", name: "zzz" }
      )
    ).to.equal(1);
  });

  it("same severity, different name sorts on name", () => {
    expect(
      compareRules(
        { severity: "info", name: "thing" },
        { severity: "info", name: "thang" }
      )
    ).to.equal(1);
  });
});
