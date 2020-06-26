/* eslint-disable no-unused-expressions */
const path = require("path");
const fs = require("fs");
const stream = require("stream");
const expect = require("chai").expect;
const getInStream = require("~/src/cli/utl/io").getInStream;

function removeDammit(pFileName) {
  try {
    fs.unlinkSync(pFileName);
  } catch (pError) {
    // probably files didn't exist in the first place
    // so ignore the exception
  } finally {
    // explicitly ignore finally as well
  }
}

describe("cli/utl/io", () => {
  const NR_OF_NUMBERS = 17;
  const OUTFILE = path.join(
    __dirname,
    "output",
    `tmp_hello_${Math.random()
      .toString()
      .split(".")
      .pop()
      .padEnd(NR_OF_NUMBERS, "0")}.json`
  );

  before("set up", () => {
    fs.writeFileSync(OUTFILE, "{}", "utf8");
  });

  after("tear down", () => {
    removeDammit(OUTFILE);
  });

  it("getInStream(OUTFILE) yields a readable stream", () => {
    expect(getInStream(OUTFILE) instanceof stream.Readable).to.be.true;
  });
  it("getInStream(OUTFILE) yields a readable file stream", () => {
    expect(getInStream(OUTFILE) instanceof fs.ReadStream).to.be.true;
  });
  it("getInStream(OUTFILE) does not yields stdin", () => {
    expect(getInStream(OUTFILE)).to.not.equal(process.stdin);
  });
  it("getInStream('-') is a readable stream", () => {
    expect(getInStream("-") instanceof stream.Readable).to.be.true;
  });
  it("getInStream('-') yields stdin", () => {
    expect(getInStream("-")).to.equal(process.stdin);
  });
  it("getInStream('-') does not yield a file stream", () => {
    expect(getInStream("-") instanceof fs.ReadStream).to.be.false;
  });
});
