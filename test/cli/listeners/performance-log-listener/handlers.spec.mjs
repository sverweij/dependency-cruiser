/* eslint-disable no-magic-numbers */
import { match, notStrictEqual, ok, equal } from "node:assert/strict";
import {
  getHeader,
  getEndText,
  getProgressLine,
} from "#cli/listeners/performance-log/handlers.mjs";

const MAX_LEVEL = 20;

describe("[U] cli/listeners/performance-log/handlers - getHeader", () => {
  it("when the level is > the max => empty string", () => {
    equal(getHeader(30, MAX_LEVEL), "");
  });
  it("when the level === the max => non-empty string", () => {
    ok(getHeader(20, MAX_LEVEL));
  });
  it("when the level is < the max => non-empty string", () => {
    ok(getHeader(10, MAX_LEVEL));
  });
});

describe("[U] cli/listeners/performance-log/handlers - getProgressLine", () => {
  const lStateMock = {
    previousTime: process.uptime() - 10,
    previousMessage: "previous message",
  };
  it("when the level is > the max => empty string", () => {
    equal(getProgressLine("message", lStateMock, 30, MAX_LEVEL), "");
  });
  it("when the level === the max => non-empty string", () => {
    ok(getProgressLine("message", lStateMock, 20, MAX_LEVEL));
  });
  it("when the level is < the max => non-empty string", () => {
    ok(getProgressLine("message", lStateMock, 10, MAX_LEVEL));
  });
  it("message contains the previous message - state is updated", () => {
    const lUpdatableStateMock = {
      previousTime: process.uptime() - 10,
      previousMessage: "previous message",
    };
    const lPreviousTime = lUpdatableStateMock.previousMessage;

    match(
      getProgressLine("next message", lUpdatableStateMock, 10, MAX_LEVEL),
      /previous message/,
    );
    equal(lUpdatableStateMock.previousMessage, "next message");
    notStrictEqual(lUpdatableStateMock.previousTime, lPreviousTime);
  });
});

describe("[U] cli/listeners/performance-log/handlers - getEndText", () => {
  const lStateMock = {
    previousTime: process.uptime() - 10,
    previousHeapUsed: process.memoryUsage().heapUsed - 1000,
  };
  it("when the level is > the max => empty string", () => {
    equal(getEndText(lStateMock, 30, MAX_LEVEL), "");
  });
  it("when the level === the max => non-empty string", () => {
    ok(getEndText(lStateMock, 20, MAX_LEVEL));
  });
  it("when the level is < the max => non-empty string", () => {
    ok(getEndText(lStateMock, 10, MAX_LEVEL));
  });

  it("message contains a line with totals", () => {
    match(
      getEndText(lStateMock, 10, MAX_LEVEL),
      /really done\n------------- ------------- ------------- ------------- ------------- ------------- ------------- ------------------------------------------\n[ ]*[+-]?[0-9,]+kB[ ]*[+-]?[0-9,]+kB[ ]*[+-]?[0-9,]+kB[ ]*[+-]?[0-9,]+kB[ ]*[0-9,]+ms[ ]*[0-9,]+ms[ ]*[0-9,]+ms/g,
    );
  });
});
