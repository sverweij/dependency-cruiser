/* eslint-disable no-unused-expressions */
import { ReadStream } from "node:fs";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import { getInStream } from "../../../src/cli/utl/io.mjs";

describe("[U] cli/utl/io", () => {
  const OUTFILE = fileURLToPath(
    new URL("__fixtures__/empty.json", import.meta.url)
  );

  it("getInStream(OUTFILE) yields a readable stream", () => {
    expect(getInStream(OUTFILE) instanceof Readable).to.be.true;
  });
  it("getInStream(OUTFILE) yields a readable file stream", () => {
    expect(getInStream(OUTFILE) instanceof ReadStream).to.be.true;
  });
  it("getInStream(OUTFILE) does not yields stdin", () => {
    expect(getInStream(OUTFILE)).to.not.equal(process.stdin);
  });
  it("getInStream('-') is a readable stream", () => {
    expect(getInStream("-") instanceof Readable).to.be.true;
  });
  it("getInStream('-') yields stdin", () => {
    expect(getInStream("-")).to.equal(process.stdin);
  });
  it("getInStream('-') does not yield a file stream", () => {
    expect(getInStream("-") instanceof ReadStream).to.be.false;
  });
});
