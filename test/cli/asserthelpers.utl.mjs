import { readFileSync } from "node:fs";
import { deepEqual, equal } from "node:assert/strict";
import normalizeNewline from "normalize-newline";
import normBaseDirectory from "../main/norm-base-directory.utl.mjs";

const DUMMY_ENVIRONMENT = {
  version: "481",
  nodeVersionSupported: "^42",
  nodeVersionFound: "42.1.2",
  osVersionFound: `riscv pinecil@1.2.3`,
  transpilersFound: [],
  extensionsFound: [],
};

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
