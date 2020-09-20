/* eslint-disable no-unused-expressions */
const { expect } = require("chai");
const { isCore } = require("~/src/extract/resolve/module-classifiers");

describe("extract/resolve/module-classifiers - isCore", () => {
  it("returns false when passed nothing", () => {
    expect(isCore()).to.equal(false);
  });

  it("returns false when passed null", () => {
    expect(isCore(null)).to.equal(false);
  });

  it("returns false when passed a local module", () => {
    expect(isCore("./path")).to.equal(false);
  });

  it("returns false when passed a non core module", () => {
    expect(isCore("flowdash")).to.equal(false);
  });

  it("returns true when passed a core module", () => {
    expect(isCore("path")).to.equal(true);
  });
});
