/* eslint-disable no-unused-expressions */
const path = require("path");
const fs = require("fs");
const stream = require("stream");
const expect = require("chai").expect;
const getInStream = require("../../../src/cli/utl/io").getInStream;

const OUTFILE = path.join(
  __dirname,
  "output",
  `tmp_hello_${Math.random()
    .toString()
    .substr("0.".length)}.json`
);

const removeDammit = pFileName => {
  try {
    process.stdout.write(`|>|>|>|> unlinkin ${pFileName} starting\n`);
    fs.unlinkSync(pFileName);
    process.stdout.write(`|>|>|>|> unlinkin ${pFileName} done\n`);
  } catch (e) {
    // probably files didn't exist in the first place
    // so ignore the exception
    process.stdout.write(`|>|>|>|> could not unlink ${pFileName} - ${e}\n`);
  } finally {
    // explicitly ignore finally as well
    process.stdout.write(`|>|>|>|> finally!\n`);
  }
};

describe("cli/utl/io", () => {
  before("set up", () => {
    process.stdout.write(`|>|>|> set up\n`);
    removeDammit(OUTFILE);
    process.stdout.write(`|>|>|> set up - removed\n`);
    fs.writeFileSync(OUTFILE, "{}", "utf8");
    process.stdout.write(`|>|>|> set up - written\n`);
  });

  after("tear down", () => {
    process.stdout.write(`|>|>|> tear down - start\n`);
    removeDammit(OUTFILE);
    process.stdout.write(`|>|>|> tear down - done dee dee done\n`);
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
  it("getInStream(OUTFILE) yields a readable stream", () => {
    expect(getInStream(OUTFILE) instanceof stream.Readable).to.be.true;
  });
  it("getInStream(OUTFILE) yields a readable file stream", () => {
    expect(getInStream(OUTFILE) instanceof fs.ReadStream).to.be.true;
  });
  it("getInStream(OUTFILE) does not yields stdin", () => {
    expect(getInStream(OUTFILE)).to.not.equal(process.stdin);
  });
});
