/* eslint-disable no-magic-numbers */
const chai = require("chai");
const {
  formatTime,
  formatMemory,
  formatPerfLine,
} = require("~/src/cli/ears/performance-log-listener/format-helpers");

const expect = chai.expect;

describe("cli/ears/performance-log-listener/format-helpers - formatTime", () => {
  it("converts to ms, leftpads & adds the unit at the end", () => {
    expect(formatTime(14.88041018)).to.equal("  14880ms");
  });

  it("converts to ms, leftpads & adds the unit at the end (0)", () => {
    expect(formatTime(0)).to.equal("      0ms");
  });

  it("converts to ms, leftpads & adds the unit at the end (negative numbers)", () => {
    expect(formatTime(-3.1415926535)).to.equal("  -3142ms");
  });

  it("converts to ms, leftpads & adds the unit at the end (null treatment => 0)", () => {
    expect(formatTime(null)).to.equal("      0ms");
  });

  it("converts to ms, leftpads & adds the unit at the end (undefined treatment => NaN)", () => {
    expect(formatTime()).to.equal("    NaNms");
  });

  it("converts to ms, leftpads & adds the unit at the end (non-number treatment => NaN)", () => {
    expect(formatTime("not a number")).to.equal("    NaNms");
  });
});

describe("cli/ears/performance-log-listener/format-helpers - formatMemory", () => {
  it("converts to Mb, leftpads & adds the unit at the end", () => {
    expect(formatMemory(4033856)).to.equal("      4Mb");
  });

  it("converts to Mb, leftpads & adds the unit at the end (0)", () => {
    expect(formatMemory(0)).to.equal("      0Mb");
  });

  it("converts to Mb, leftpads & adds the unit at the end (negative numbers)", () => {
    expect(formatMemory(-403385623)).to.equal("   -385Mb");
  });

  it("converts to Mb, leftpads & adds the unit at the end (null)", () => {
    expect(formatMemory(0)).to.equal("      0Mb");
  });

  it("converts to Mb, leftpads & adds the unit at the end (undefined)", () => {
    expect(formatMemory()).to.equal("    NaNMb");
  });

  it("converts to Mb, leftpads & adds the unit at the end (not a number)", () => {
    expect(formatMemory("not a number")).to.equal("    NaNMb");
  });
});

describe("cli/ears/performance-log-listener/format-helpers - formatPerfLine", () => {
  it("produces neat columns with time, memmory and a message", () => {
    expect(formatPerfLine(14.88041018, 7.245436738, "sim sala bim")).to.match(
      / {3}7635ms {0,}[0-9]+Mb {0,}[0-9]+Mb sim sala bim\n/
    );
  });
});
