const { expect } = require("chai");
const compare = require("~/src/utl/compare");

describe("utl/compare - severities", () => {
  it("returns 0 for identical severities", () => {
    expect(compare.severities("warn", "warn")).to.equal(0);
  });

  it("returns 0 for identical severities - even unknown ones", () => {
    expect(compare.severities("unknown", "unknown")).to.equal(0);
  });

  it("returns -1 when comparing an unknown severity with a known one", () => {
    expect(compare.severities("unknown", "error")).to.equal(-1);
  });

  it("returns 1 when comparing a known severity with an unknown one", () => {
    expect(compare.severities("info", "unknown")).to.equal(1);
  });

  it("returns 1 when comparing a less severe severity with a more severe one", () => {
    expect(compare.severities("info", "error")).to.equal(1);
  });

  it("returns -1 when comparing a more severe severity with a less severe one", () => {
    expect(compare.severities("error", "info")).to.equal(-1);
  });
});
