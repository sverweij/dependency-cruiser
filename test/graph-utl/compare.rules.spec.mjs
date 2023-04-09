import { expect } from "chai";
import { rules } from "../../src/graph-utl/compare.mjs";

describe("[U] graph-utl/compare - rules", () => {
  it("samesies yield 0", () => {
    expect(
      rules(
        { severity: "error", name: "thing" },
        { severity: "error", name: "thing" }
      )
    ).to.equal(0);
  });

  it("unknown severity > error", () => {
    expect(
      rules(
        { severity: "not defined", name: "thing" },
        { severity: "error", name: "thing" }
      )
    ).to.equal(-1);
  });

  it("same name, different severity sorts on severity", () => {
    expect(
      rules(
        { severity: "info", name: "thing" },
        { severity: "warn", name: "thing" }
      )
    ).to.equal(1);
  });

  it("differnt name, different severity sorts on severity", () => {
    expect(
      rules(
        { severity: "info", name: "aaa" },
        { severity: "warn", name: "zzz" }
      )
    ).to.equal(1);
  });

  it("same severity, different name sorts on name", () => {
    expect(
      rules(
        { severity: "info", name: "thing" },
        { severity: "info", name: "thang" }
      )
    ).to.equal(1);
  });
});
