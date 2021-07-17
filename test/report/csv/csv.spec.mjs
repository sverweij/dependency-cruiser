import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { expect } from "chai";
import render from "../../../src/report/csv.js";
import deps from "./mocks/cjs-no-dependency-valid.mjs";

const elementFixture = readFileSync(
  fileURLToPath(new URL("mocks/cjs-no-dependency-valid.csv", import.meta.url)),
  "utf8"
);

describe("report/csv reporter", () => {
  it("renders csv", () => {
    const lReturnValue = render(deps);

    expect(lReturnValue.output).to.deep.equal(elementFixture);
    expect(lReturnValue.exitCode).to.equal(0);
  });
});
