import { readFileSync } from "fs";
import { expect } from "chai";

export function assertFileEqual(pActualFileName, pExpectedFileName) {
  expect(readFileSync(pActualFileName, { encoding: "utf8" })).to.equal(
    readFileSync(pExpectedFileName, { encoding: "utf8" })
  );
}
export function assertJSONFileEqual(pActualFileName, pExpectedFileName) {
  expect(
    JSON.parse(readFileSync(pActualFileName, { encoding: "utf8" }))
  ).to.deep.equal(
    JSON.parse(readFileSync(pExpectedFileName, { encoding: "utf8" }))
  );
}
