const { expect } = require("chai");
const wrap = require("~/src/extract/transpile/livescript-wrap");

describe("livescript transpiler", () => {
  it("tells the livescript transpiler is not available", () => {
    expect(wrap.isAvailable()).to.equal(false);
  });
});
