import { equal } from "node:assert/strict";
import { severities } from "../../src/graph-utl/compare.mjs";

describe("[U] graph-utl/compare - severities", () => {
  it("returns 0 for identical severities", () => {
    equal(severities("warn", "warn"), 0);
  });

  it("returns 0 for identical severities - even unknown ones", () => {
    equal(severities("unknown", "unknown"), 0);
  });

  it("returns -1 when comparing an unknown severity with a known one", () => {
    equal(severities("unknown", "error"), -1);
  });

  it("returns 1 when comparing a known severity with an unknown one", () => {
    equal(severities("info", "unknown"), 1);
  });

  it("returns 1 when comparing a less severe severity with a more severe one", () => {
    equal(severities("info", "error"), 1);
  });

  it("returns -1 when comparing a more severe severity with a less severe one", () => {
    equal(severities("error", "info"), -1);
  });
});
