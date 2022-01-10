/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
import { expect } from "chai";
import handlers from "../../../../src/cli/listeners/performance-log/handlers.js";

const MAX_LEVEL = 20;

describe("[U] cli/listeners/performance-log/handlers - getHeader", () => {
  it("when the level is > the max => empty string", () => {
    expect(handlers.getHeader(30, MAX_LEVEL)).to.equal("");
  });
  it("when the level === the max => non-empty string", () => {
    expect(handlers.getHeader(20, MAX_LEVEL)).to.be.not.empty;
  });
  it("when the level is < the max => non-empty string", () => {
    expect(handlers.getHeader(10, MAX_LEVEL)).to.be.not.empty;
  });
});

describe("[U] cli/listeners/performance-log/handlers - getProgressLine", () => {
  const lStateMock = {
    previousTime: process.uptime() - 10,
    previousMessage: "previous message",
  };
  it("when the level is > the max => empty string", () => {
    expect(
      handlers.getProgressLine("message", lStateMock, 30, MAX_LEVEL)
    ).to.equal("");
  });
  it("when the level === the max => non-empty string", () => {
    expect(handlers.getProgressLine("message", lStateMock, 20, MAX_LEVEL)).to.be
      .not.empty;
  });
  it("when the level is < the max => non-empty string", () => {
    expect(handlers.getProgressLine("message", lStateMock, 10, MAX_LEVEL)).to.be
      .not.empty;
  });
  it("message contains the previous message - state is updated", () => {
    const lUpdatableStateMock = {
      previousTime: process.uptime() - 10,
      previousMessage: "previous message",
    };
    const lPreviousTime = lUpdatableStateMock.previousMessage;

    expect(
      handlers.getProgressLine(
        "next message",
        lUpdatableStateMock,
        10,
        MAX_LEVEL
      )
    ).to.match(/previous message/);
    expect(lUpdatableStateMock.previousMessage).to.equal("next message");
    expect(lUpdatableStateMock.previousTime).to.not.equal(lPreviousTime);
  });
});

describe("[U] cli/listeners/performance-log/handlers - getEndText", () => {
  const lStateMock = {
    previousTime: process.uptime() - 10,
  };
  it("when the level is > the max => empty string", () => {
    expect(handlers.getEndText(lStateMock, 30, MAX_LEVEL)).to.equal("");
  });
  it("when the level === the max => non-empty string", () => {
    expect(handlers.getEndText(lStateMock, 20, MAX_LEVEL)).to.be.not.empty;
  });
  it("when the level is < the max => non-empty string", () => {
    expect(handlers.getEndText(lStateMock, 10, MAX_LEVEL)).to.be.not.empty;
  });

  it("message contains an end time", () => {
    expect(handlers.getEndText(lStateMock, 10, MAX_LEVEL)).to.match(
      /really done \([0-9]+ms\)\n$/g
    );
  });
});
