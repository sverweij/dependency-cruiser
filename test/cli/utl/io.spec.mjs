import { ReadStream } from "node:fs";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { deepEqual, notDeepStrictEqual, equal } from "node:assert/strict";
import { getInStream } from "../../../src/cli/utl/io.mjs";

describe("[U] cli/utl/io", () => {
  const OUTFILE = fileURLToPath(
    new URL("__fixtures__/empty.json", import.meta.url),
  );

  it("getInStream(OUTFILE) yields a readable stream", () => {
    equal(getInStream(OUTFILE) instanceof Readable, true);
  });
  it("getInStream(OUTFILE) yields a readable file stream", () => {
    equal(getInStream(OUTFILE) instanceof ReadStream, true);
  });
  it("getInStream(OUTFILE) does not yield stdin", () => {
    notDeepStrictEqual(getInStream(OUTFILE), process.stdin);
  });
  it("getInStream('-') is a readable stream", () => {
    equal(getInStream("-") instanceof Readable, true);
  });
  it("getInStream('-') yields stdin", () => {
    deepEqual(getInStream("-"), process.stdin);
  });
  it("getInStream('-') does not yield a file stream", () => {
    equal(getInStream("-") instanceof ReadStream, false);
  });
});
