import { equal } from "node:assert/strict";
import { compareSeverities } from "#graph-utl/compare.mjs";

describe("[U] graph-utl/compare - severities", () => {
  it("returns 0 for identical severities", () => {
    equal(compareSeverities("warn", "warn"), 0);
  });

  it("returns 0 for identical severities - even unknown ones", () => {
    equal(compareSeverities("unknown", "unknown"), 0);
  });

  it("returns -1 when comparing an unknown severity with a known one", () => {
    equal(compareSeverities("unknown", "error"), -1);
  });

  it("returns 1 when comparing a known severity with an unknown one", () => {
    equal(compareSeverities("info", "unknown"), 1);
  });

  it("returns 1 when comparing a less severe severity with a more severe one", () => {
    equal(compareSeverities("info", "error"), 1);
  });

  it("returns -1 when comparing a more severe severity with a less severe one", () => {
    equal(compareSeverities("error", "info"), -1);
  });
});
