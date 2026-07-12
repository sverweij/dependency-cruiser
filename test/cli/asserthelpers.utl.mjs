import { readFileSync } from "node:fs";
import { deepEqual, equal } from "node:assert/strict";
import normalizeNewline from "normalize-newline";
import normBaseDirectory from "../main/norm-base-directory.utl.mjs";
import { DUMMY_ENVIRONMENT } from "../utl/dummy-environment.mjs";

const neutralizeEnvironment = (pKey, pValue) =>
  pKey === "environment" ? DUMMY_ENVIRONMENT : pValue;

export function assertFileEqual(pActualFileName, pExpectedFileName) {
  equal(
    normalizeNewline(readFileSync(pActualFileName, { encoding: "utf8" })),
    normalizeNewline(readFileSync(pExpectedFileName, { encoding: "utf8" })),
  );
}
export function assertJSONFileEqual(pActualFileName, pExpectedFileName) {
  deepEqual(
    JSON.parse(
      readFileSync(pActualFileName, { encoding: "utf8" }),
      neutralizeEnvironment,
    ),
    normBaseDirectory(
      JSON.parse(
        readFileSync(pExpectedFileName, { encoding: "utf8" }),
        neutralizeEnvironment,
      ),
    ),
  );
}
