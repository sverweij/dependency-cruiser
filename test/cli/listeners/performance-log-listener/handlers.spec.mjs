/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
import { expect } from "chai";
import {
  getHeader,
  getEndText,
  getProgressLine,
} from "../../../../src/cli/listeners/performance-log/handlers.mjs";

const MAX_LEVEL = 20;

describe("[U] cli/listeners/performance-log/handlers - getHeader", () => {
  it("when the level is > the max => empty string", () => {
    expect(getHeader(30, MAX_LEVEL)).to.equal("");
  });
  it("when the level === the max => non-empty string", () => {
    expect(getHeader(20, MAX_LEVEL)).to.be.not.empty;
  });
  it("when the level is < the max => non-empty string", () => {
    expect(getHeader(10, MAX_LEVEL)).to.be.not.empty;
  });
});

describe("[U] cli/listeners/performance-log/handlers - getProgressLine", () => {
  const lStateMock = {
    previousTime: process.uptime() - 10,
    previousMessage: "previous message",
  };
  it("when the level is > the max => empty string", () => {
    expect(getProgressLine("message", lStateMock, 30, MAX_LEVEL)).to.equal("");
  });
  it("when the level === the max => non-empty string", () => {
    expect(getProgressLine("message", lStateMock, 20, MAX_LEVEL)).to.be.not
      .empty;
  });
  it("when the level is < the max => non-empty string", () => {
    expect(getProgressLine("message", lStateMock, 10, MAX_LEVEL)).to.be.not
      .empty;
  });
  it("message contains the previous message - state is updated", () => {
    const lUpdatableStateMock = {
      previousTime: process.uptime() - 10,
      previousMessage: "previous message",
    };
    const lPreviousTime = lUpdatableStateMock.previousMessage;

    expect(
      getProgressLine("next message", lUpdatableStateMock, 10, MAX_LEVEL)
    ).to.match(/previous message/);
    expect(lUpdatableStateMock.previousMessage).to.equal("next message");
    expect(lUpdatableStateMock.previousTime).to.not.equal(lPreviousTime);
  });
});

describe("[U] cli/listeners/performance-log/handlers - getEndText", () => {
  const lStateMock = {
    previousTime: process.uptime() - 10,
    previousHeapUsed: process.memoryUsage().heapUsed - 1000,
  };
  it("when the level is > the max => empty string", () => {
    expect(getEndText(lStateMock, 30, MAX_LEVEL)).to.equal("");
  });
  it("when the level === the max => non-empty string", () => {
    expect(getEndText(lStateMock, 20, MAX_LEVEL)).to.be.not.empty;
  });
  it("when the level is < the max => non-empty string", () => {
    expect(getEndText(lStateMock, 10, MAX_LEVEL)).to.be.not.empty;
  });

  it("message contains a line with totals", () => {
    expect(getEndText(lStateMock, 10, MAX_LEVEL)).to.match(
      /really done\n------------- ------------- ------------- ------------- ------------- ------------- ------------- ------------- \n[ ]*[+-]?[0-9,]+kB[ ]*[+-]?[0-9,]+kB[ ]*[+-]?[0-9,]+kB[ ]*[+-]?[0-9,]+kB[ ]*[0-9,]+ms[ ]*[0-9,]+ms[ ]*[0-9,]+ms/g
    );
  });
});
