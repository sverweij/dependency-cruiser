import { equal } from "node:assert/strict";
import { rules } from "#graph-utl/compare.mjs";

describe("[U] graph-utl/compare - rules", () => {
  it("samesies yield 0", () => {
    equal(
      rules(
        { severity: "error", name: "thing" },
        { severity: "error", name: "thing" },
      ),
      0,
    );
  });

  it("unknown severity > error", () => {
    equal(
      rules(
        { severity: "not defined", name: "thing" },
        { severity: "error", name: "thing" },
      ),
      -1,
    );
  });

  it("same name, different severity sorts on severity", () => {
    equal(
      rules(
        { severity: "info", name: "thing" },
        { severity: "warn", name: "thing" },
      ),
      1,
    );
  });

  it("differnt name, different severity sorts on severity", () => {
    equal(
      rules(
        { severity: "info", name: "aaa" },
        { severity: "warn", name: "zzz" },
      ),
      1,
    );
  });

  it("same severity, different name sorts on name", () => {
    equal(
      rules(
        { severity: "info", name: "thing" },
        { severity: "info", name: "thang" },
      ),
      1,
    );
  });
});
