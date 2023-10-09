/* eslint-disable no-magic-numbers */
import { match, equal } from "node:assert/strict";
import chalk from "chalk";
import {
  formatTime,
  formatMemory,
  formatPerfLine,
} from "#cli/listeners/performance-log/format-helpers.mjs";

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
    equal(formatTime(14.88041018), "     14,880ms ");
  });

  it("converts to ms, left pads & adds the unit at the end (0)", () => {
    equal(formatTime(0), "          0ms ");
  });

  it("converts to ms, left pads & adds the unit at the end (negative numbers)", () => {
    equal(formatTime(-3.1415926535), "     -3,142ms ");
  });

  it("converts to ms, left pads & adds the unit at the end (null treatment => 0)", () => {
    equal(formatTime(null), "          0ms ");
  });

  it("converts to ms, left pads & adds the unit at the end (undefined treatment => NaN)", () => {
    equal(formatTime(), "        NaNms ");
  });

  it("converts to ms, left pads & adds the unit at the end (non-number treatment => NaN)", () => {
    equal(formatTime("not a number"), "        NaNms ");
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
    equal(formatMemory(4033856), "     +3,939kB ");
  });

  it("converts to kB, left pads & adds the unit at the end (0)", () => {
    equal(formatMemory(0), "          0kB ");
  });

  it("converts to kB, left pads & adds the unit at the end (negative numbers)", () => {
    equal(formatMemory(-403385623), "   -393,931kB ");
  });

  it("converts to kB, left pads & adds the unit at the end (null)", () => {
    equal(formatMemory(0), "          0kB ");
  });

  it("converts to kB, left pads & adds the unit at the end (undefined)", () => {
    equal(formatMemory(), "        NaNkB ");
  });

  it("converts to kB, left pads & adds the unit at the end (not a number)", () => {
    equal(formatMemory("not a number"), "        NaNkB ");
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
    match(
      formatPerfLine(lStats, "sim sala bim"),
      / {0,}\+3,144kB {0,}\+2,420kB {0,}\+2,791kB {0,}0kB  {0,}4ms {0,}16ms {0,}7,635ms sim sala bim\n/,
    );
  });
});
