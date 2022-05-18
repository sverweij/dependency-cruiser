/* eslint-disable no-magic-numbers */
import { expect } from "chai";
import formatHelpers from "../../../../src/cli/listeners/performance-log/format-helpers.js";

describe("[U] cli/listeners/performance-log/format-helpers - formatTime", () => {
  it("converts to ms, leftpads & adds the unit at the end", () => {
    expect(formatHelpers.formatTime(14.88041018)).to.equal("  14880ms");
  });

  it("converts to ms, leftpads & adds the unit at the end (0)", () => {
    expect(formatHelpers.formatTime(0)).to.equal("      0ms");
  });

  it("converts to ms, leftpads & adds the unit at the end (negative numbers)", () => {
    expect(formatHelpers.formatTime(-3.1415926535)).to.equal("  -3142ms");
  });

  it("converts to ms, leftpads & adds the unit at the end (null treatment => 0)", () => {
    expect(formatHelpers.formatTime(null)).to.equal("      0ms");
  });

  it("converts to ms, leftpads & adds the unit at the end (undefined treatment => NaN)", () => {
    expect(formatHelpers.formatTime()).to.equal("    NaNms");
  });

  it("converts to ms, leftpads & adds the unit at the end (non-number treatment => NaN)", () => {
    expect(formatHelpers.formatTime("not a number")).to.equal("    NaNms");
  });
});

describe("[U] cli/listeners/performance-log/format-helpers - formatMemory", () => {
  it("converts to Mb, leftpads & adds the unit at the end", () => {
    expect(formatHelpers.formatMemory(4033856)).to.equal("      4Mb");
  });

  it("converts to Mb, leftpads & adds the unit at the end (0)", () => {
    expect(formatHelpers.formatMemory(0)).to.equal("      0Mb");
  });

  it("converts to Mb, leftpads & adds the unit at the end (negative numbers)", () => {
    expect(formatHelpers.formatMemory(-403385623)).to.equal("   -385Mb");
  });

  it("converts to Mb, leftpads & adds the unit at the end (null)", () => {
    expect(formatHelpers.formatMemory(0)).to.equal("      0Mb");
  });

  it("converts to Mb, leftpads & adds the unit at the end (undefined)", () => {
    expect(formatHelpers.formatMemory()).to.equal("    NaNMb");
  });

  it("converts to Mb, leftpads & adds the unit at the end (not a number)", () => {
    expect(formatHelpers.formatMemory("not a number")).to.equal("    NaNMb");
  });
});

describe("[U] cli/ears/performance-log-listener/format-helpers - formatPerfLine", () => {
  it("produces neat columns with time, memmory and a message", () => {
    expect(
      formatHelpers.formatPerfLine(14.88041018, 7.245436738, "sim sala bim")
    ).to.match(/ {3}7635ms {0,}\d+Mb {0,}\d+Mb sim sala bim\n/);
  });
});
