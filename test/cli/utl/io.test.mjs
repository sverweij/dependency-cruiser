import { deepStrictEqual, notDeepStrictEqual, strictEqual } from "node:assert";
import { ReadStream } from "node:fs";
import { Readable } from "node:stream";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { getInStream } from "../../../src/cli/utl/io.mjs";

describe("[U] cli/utl/io", () => {
  const OUTFILE = fileURLToPath(
    new URL("__fixtures__/empty.json", import.meta.url)
  );

  it("getInStream(OUTFILE) yields a readable stream", () => {
    strictEqual(getInStream(OUTFILE) instanceof Readable, true);
  });
  it("getInStream(OUTFILE) yields a readable file stream", () => {
    strictEqual(getInStream(OUTFILE) instanceof ReadStream, true);
  });
  it("getInStream(OUTFILE) does not yield stdin", () => {
    notDeepStrictEqual(getInStream(OUTFILE), process.stdin);
  });
  it("getInStream('-') is a readable stream", () => {
    strictEqual(getInStream("-") instanceof Readable, true);
  });
  it("getInStream('-') yields stdin", () => {
    deepStrictEqual(getInStream("-"), process.stdin);
  });
  it("getInStream('-') does not yield a file stream", () => {
    strictEqual(getInStream("-") instanceof ReadStream, false);
  });
});
