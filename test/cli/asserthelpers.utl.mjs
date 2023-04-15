import { readFileSync } from "node:fs";
import { expect } from "chai";
import normalizeNewline from "normalize-newline";
import normBaseDirectory from "../main/norm-base-directory.utl.mjs";

export function assertFileEqual(pActualFileName, pExpectedFileName) {
  expect(
    normalizeNewline(readFileSync(pActualFileName, { encoding: "utf8" }))
  ).to.equal(
    normalizeNewline(readFileSync(pExpectedFileName, { encoding: "utf8" }))
  );
}
export function assertJSONFileEqual(pActualFileName, pExpectedFileName) {
  expect(
    JSON.parse(readFileSync(pActualFileName, { encoding: "utf8" }))
  ).to.deep.equal(
    normBaseDirectory(
      JSON.parse(readFileSync(pExpectedFileName, { encoding: "utf8" }))
    )
  );
}
