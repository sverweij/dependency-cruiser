import { readFileSync } from "node:fs";
import { deepEqual } from "node:assert/strict";
import normalizeNewline from "normalize-newline";
import normBaseDirectory from "../main/norm-base-directory.utl.mjs";

export function assertFileEqual(pActualFileName, pExpectedFileName) {
  deepEqual(
    normalizeNewline(readFileSync(pActualFileName, { encoding: "utf8" })),
    normalizeNewline(readFileSync(pExpectedFileName, { encoding: "utf8" })),
  );
}
export function assertJSONFileEqual(pActualFileName, pExpectedFileName) {
  deepEqual(
    JSON.parse(readFileSync(pActualFileName, { encoding: "utf8" })),
    normBaseDirectory(
      JSON.parse(readFileSync(pExpectedFileName, { encoding: "utf8" })),
    ),
  );
}
