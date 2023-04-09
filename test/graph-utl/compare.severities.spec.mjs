import { expect } from "chai";
import { severities } from "../../src/graph-utl/compare.mjs";

describe("[U] graph-utl/compare - severities", () => {
  it("returns 0 for identical severities", () => {
    expect(severities("warn", "warn")).to.equal(0);
  });

  it("returns 0 for identical severities - even unknown ones", () => {
    expect(severities("unknown", "unknown")).to.equal(0);
  });

  it("returns -1 when comparing an unknown severity with a known one", () => {
    expect(severities("unknown", "error")).to.equal(-1);
  });

  it("returns 1 when comparing a known severity with an unknown one", () => {
    expect(severities("info", "unknown")).to.equal(1);
  });

  it("returns 1 when comparing a less severe severity with a more severe one", () => {
    expect(severities("info", "error")).to.equal(1);
  });

  it("returns -1 when comparing a more severe severity with a less severe one", () => {
    expect(severities("error", "info")).to.equal(-1);
  });
});
