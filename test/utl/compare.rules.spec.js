const expect = require("chai").expect;
const compare = require("~/src/utl/compare");

describe("utl/compare - rules", () => {
  it("samesies yield 0", () => {
    expect(
      compare.rules(
        { severity: "error", name: "thing" },
        { severity: "error", name: "thing" }
      )
    ).to.equal(0);
  });

  it("unknown severity > error", () => {
    expect(
      compare.rules(
        { severity: "not defined", name: "thing" },
        { severity: "error", name: "thing" }
      )
    ).to.equal(-1);
  });

  it("same name, different severity sorts on severity", () => {
    expect(
      compare.rules(
        { severity: "info", name: "thing" },
        { severity: "warn", name: "thing" }
      )
    ).to.equal(1);
  });

  it("differnt name, different severity sorts on severity", () => {
    expect(
      compare.rules(
        { severity: "info", name: "aaa" },
        { severity: "warn", name: "zzz" }
      )
    ).to.equal(1);
  });

  it("same severity, different name sorts on name", () => {
    expect(
      compare.rules(
        { severity: "info", name: "thing" },
        { severity: "info", name: "thang" }
      )
    ).to.equal(1);
  });
});
