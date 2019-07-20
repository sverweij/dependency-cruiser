const expect = require("chai").expect;
const order = require("../../../src/extract/utl/order");

describe("extract/utl/order - severities", () => {
  it("returns 0 for identical severities", () => {
    expect(order.severities("warn", "warn")).to.equal(0);
  });

  it("returns 0 for identical severities - even unknown ones", () => {
    expect(order.severities("unknown", "unknown")).to.equal(0);
  });

  it("returns -1 when comparing an unknown severity with a known one", () => {
    expect(order.severities("unknown", "error")).to.equal(-1);
  });

  it("returns 1 when comparing a known severity with an unknown one", () => {
    expect(order.severities("info", "unknown")).to.equal(1);
  });

  it("returns 1 when comparing a less severe severity with a more severe one", () => {
    expect(order.severities("info", "error")).to.equal(1);
  });

  it("returns -1 when comparing a more severe severity with a less severe one", () => {
    expect(order.severities("error", "info")).to.equal(-1);
  });
});
