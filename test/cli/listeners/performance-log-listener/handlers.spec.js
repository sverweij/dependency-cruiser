/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
const chai = require("chai");
const {
  getHeader,
  getProgressLine,
  getEndText,
} = require("../../../../src/cli/listeners/performance-log/handlers");

const expect = chai.expect;

const MAX_LEVEL = 20;

describe("cli/listeners/performance-log/handlers - getHeader", () => {
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

describe("cli/listeners/performance-log/handlers - getProgressLine", () => {
  const STATE_MOCK = {
    previousTime: process.uptime() - 10,
    previousMessage: "previous message",
  };
  it("when the level is > the max => empty string", () => {
    expect(getProgressLine("message", STATE_MOCK, 30, MAX_LEVEL)).to.equal("");
  });
  it("when the level === the max => non-empty string", () => {
    expect(getProgressLine("message", STATE_MOCK, 20, MAX_LEVEL)).to.be.not
      .empty;
  });
  it("when the level is < the max => non-empty string", () => {
    expect(getProgressLine("message", STATE_MOCK, 10, MAX_LEVEL)).to.be.not
      .empty;
  });
  it("message contains the previous message - state is updated", () => {
    const lStateMock = {
      previousTime: process.uptime() - 10,
      previousMessage: "previous message",
    };
    const lPreviousTime = lStateMock.previousMessage;

    expect(getProgressLine("next message", lStateMock, 10, MAX_LEVEL)).to.match(
      /previous message/
    );
    expect(lStateMock.previousMessage).to.equal("next message");
    expect(lStateMock.previousTime).to.not.equal(lPreviousTime);
  });
});

describe("cli/listeners/performance-log/handlers - getEndText", () => {
  const STATE_MOCK = {
    previousTime: process.uptime() - 10,
  };
  it("when the level is > the max => empty string", () => {
    expect(getEndText(STATE_MOCK, 30, MAX_LEVEL)).to.equal("");
  });
  it("when the level === the max => non-empty string", () => {
    expect(getEndText(STATE_MOCK, 20, MAX_LEVEL)).to.be.not.empty;
  });
  it("when the level is < the max => non-empty string", () => {
    expect(getEndText(STATE_MOCK, 10, MAX_LEVEL)).to.be.not.empty;
  });

  it("message contains an end time", () => {
    expect(getEndText(STATE_MOCK, 10, MAX_LEVEL)).to.match(
      /really done \([0-9]+ms\)\n$/g
    );
  });
});
