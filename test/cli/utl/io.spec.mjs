/* eslint-disable no-unused-expressions */
import { unlinkSync, writeFileSync, ReadStream } from "node:fs";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import io from "../../../src/cli/utl/io.js";

function removeDammit(pFileName) {
  try {
    unlinkSync(pFileName);
  } catch (pError) {
    // probably files didn't exist in the first place
    // so ignore the exception
  } finally {
    // explicitly ignore finally as well
  }
}

describe("cli/utl/io", () => {
  const OUTFILE = fileURLToPath(
    new URL("./output/tmp_hello_cli_utl_io.json", import.meta.url)
  );

  before("set up", () => {
    writeFileSync(OUTFILE, "{}", "utf8");
  });

  after("tear down", () => {
    removeDammit(OUTFILE);
  });

  it("getInStream(OUTFILE) yields a readable stream", () => {
    expect(io.getInStream(OUTFILE) instanceof Readable).to.be.true;
  });
  it("getInStream(OUTFILE) yields a readable file stream", () => {
    expect(io.getInStream(OUTFILE) instanceof ReadStream).to.be.true;
  });
  it("getInStream(OUTFILE) does not yields stdin", () => {
    expect(io.getInStream(OUTFILE)).to.not.equal(process.stdin);
  });
  it("getInStream('-') is a readable stream", () => {
    expect(io.getInStream("-") instanceof Readable).to.be.true;
  });
  it("getInStream('-') yields stdin", () => {
    expect(io.getInStream("-")).to.equal(process.stdin);
  });
  it("getInStream('-') does not yield a file stream", () => {
    expect(io.getInStream("-") instanceof ReadStream).to.be.false;
  });
});
