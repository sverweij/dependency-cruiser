import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { severities } from "../../src/graph-utl/compare.mjs";

describe("[U] graph-utl/compare - severities", () => {
  it("returns 0 for identical severities", () => {
    strictEqual(severities("warn", "warn"), 0);
  });

  it("returns 0 for identical severities - even unknown ones", () => {
    strictEqual(severities("unknown", "unknown"), 0);
  });

  it("returns -1 when comparing an unknown severity with a known one", () => {
    strictEqual(severities("unknown", "error"), -1);
  });

  it("returns 1 when comparing a known severity with an unknown one", () => {
    strictEqual(severities("info", "unknown"), 1);
  });

  it("returns 1 when comparing a less severe severity with a more severe one", () => {
    strictEqual(severities("info", "error"), 1);
  });

  it("returns -1 when comparing a more severe severity with a less severe one", () => {
    strictEqual(severities("error", "info"), -1);
  });
});
