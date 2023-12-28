/* eslint-disable max-classes-per-file */
import { match } from "node:assert";
import { Writable } from "node:stream";

export class WritableTestStream extends Writable {
  expected = /^$/;

  /**
   * @param {RegExp=} pExpected
   */
  constructor(pExpected) {
    super();
    if (pExpected) {
      this.expected = pExpected;
    }
  }
  write(pChunk) {
    match(pChunk, this.expected);
    return true;
  }
}

export class UnCalledWritableTestStream extends Writable {
  write(pChunk) {
    throw new Error(`Unexpected write to stream: ${pChunk}`);
  }
}
