/* eslint-disable no-magic-numbers */
import { expect } from "chai";
import chalk from "chalk";
import {
  formatTime,
  formatMemory,
  formatPerfLine,
} from "../../../../src/cli/listeners/performance-log/format-helpers.mjs";

/*
 * as the formatHelpers use the Intl API, it's necessary to set the locale
 * to something uniform so we can actually work with expectations.
 *
 * The expected values are for now based on the en-US locale - as it's likely
 * to be available on most systems. To ensure the formatHelpers are also on
 * that set the LANG environment variable to en_US.UTF-8. E.g. to run these
 * tests:
 *
 * LANG=en_US.UTF-8 mocha
 *
 * (the run-scripts in dependency-cruiser's package.json have all been adjusted
 * thusly)
 */

describe("[U] cli/listeners/performance-log/format-helpers - formatTime", () => {
  it("converts to ms, left pads & adds the unit at the end", () => {
    expect(formatTime(14.88041018)).to.equal("     14,880ms ");
  });

  it("converts to ms, left pads & adds the unit at the end (0)", () => {
    expect(formatTime(0)).to.equal("          0ms ");
  });

  it("converts to ms, left pads & adds the unit at the end (negative numbers)", () => {
    expect(formatTime(-3.1415926535)).to.equal("     -3,142ms ");
  });

  it("converts to ms, left pads & adds the unit at the end (null treatment => 0)", () => {
    expect(formatTime(null)).to.equal("          0ms ");
  });

  it("converts to ms, left pads & adds the unit at the end (undefined treatment => NaN)", () => {
    expect(formatTime()).to.equal("        NaNms ");
  });

  it("converts to ms, left pads & adds the unit at the end (non-number treatment => NaN)", () => {
    expect(formatTime("not a number")).to.equal("        NaNms ");
  });
});

describe("[U] cli/listeners/performance-log/format-helpers - formatMemory", () => {
  let lChalkLevel = chalk.level;

  before("disable chalk coloring", () => {
    chalk.level = 0;
  });

  after("enable chalk coloring again", () => {
    chalk.level = lChalkLevel;
  });

  it("converts to kB, left pads & adds the unit at the end", () => {
    expect(formatMemory(4033856)).to.equal("     +3,939kB ");
  });

  it("converts to kB, left pads & adds the unit at the end (0)", () => {
    expect(formatMemory(0)).to.equal("          0kB ");
  });

  it("converts to kB, left pads & adds the unit at the end (negative numbers)", () => {
    expect(formatMemory(-403385623)).to.equal("   -393,931kB ");
  });

  it("converts to kB, left pads & adds the unit at the end (null)", () => {
    expect(formatMemory(0)).to.equal("          0kB ");
  });

  it("converts to kB, left pads & adds the unit at the end (undefined)", () => {
    expect(formatMemory()).to.equal("        NaNkB ");
  });

  it("converts to kB, left pads & adds the unit at the end (not a number)", () => {
    expect(formatMemory("not a number")).to.equal("        NaNkB ");
  });
});

describe("[U] cli/listeners/performance-log/format-helpers - formatPerfLine", () => {
  it("produces neat columns with time, memory and a message", () => {
    const lStats = {
      elapsedTime: 7.634973442,
      elapsedUser: 16497,
      elapsedSystem: 3518,
      deltaRss: 3219456,
      deltaHeapUsed: 2857936,
      deltaHeapTotal: 2478080,
      deltaExternal: 0,
      message: "sim sala bim",
    };
    expect(formatPerfLine(lStats, "sim sala bim")).to.match(
      / {0,}\+3,144kB {0,}\+2,420kB {0,}\+2,791kB {0,}0kB  {0,}4ms {0,}16ms {0,}7,635ms sim sala bim\n/
    );
  });
});
