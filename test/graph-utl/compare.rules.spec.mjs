import { strictEqual } from "node:assert";
import { rules } from "../../src/graph-utl/compare.mjs";

describe("[U] graph-utl/compare - rules", () => {
  it("samesies yield 0", () => {
    strictEqual(
      rules(
        { severity: "error", name: "thing" },
        { severity: "error", name: "thing" },
      ),
      0,
    );
  });

  it("unknown severity > error", () => {
    strictEqual(
      rules(
        { severity: "not defined", name: "thing" },
        { severity: "error", name: "thing" },
      ),
      -1,
    );
  });

  it("same name, different severity sorts on severity", () => {
    strictEqual(
      rules(
        { severity: "info", name: "thing" },
        { severity: "warn", name: "thing" },
      ),
      1,
    );
  });

  it("differnt name, different severity sorts on severity", () => {
    strictEqual(
      rules(
        { severity: "info", name: "aaa" },
        { severity: "warn", name: "zzz" },
      ),
      1,
    );
  });

  it("same severity, different name sorts on name", () => {
    strictEqual(
      rules(
        { severity: "info", name: "thing" },
        { severity: "info", name: "thang" },
      ),
      1,
    );
  });
});
