/* eslint-disable no-unused-expressions */
import { ReadStream } from "node:fs";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import io from "../../../src/cli/utl/io.js";

describe("[U] cli/utl/io", () => {
  const OUTFILE = fileURLToPath(
    new URL("__fixtures__/empty.json", import.meta.url)
  );

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
