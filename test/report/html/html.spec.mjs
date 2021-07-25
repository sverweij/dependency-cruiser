import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { expect } from "chai";
import render from "../../../src/report/html/index.js";
import deps from "./mocks/cjs-no-dependency-valid.mjs";

const elementFixture = readFileSync(
  fileURLToPath(new URL("mocks/cjs-no-dependency-valid.html", import.meta.url)),
  "utf8"
);

describe("report/html reporter", () => {
  it("renders html - modules in the root don't come in a cluster; and one module could not be resolved", () => {
    const lReturnValue = render(deps);

    expect(lReturnValue.output).to.deep.equal(elementFixture);
    expect(lReturnValue.exitCode).to.equal(0);
  });
});
