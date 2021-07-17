import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { expect } from "chai";
import renderText from "../../../src/report/text.js";
import dependencies from "./mocks/dependencies.mjs";

describe("report/text", () => {
  it("renders a bunch of dependencies", () => {
    const lResult = renderText(dependencies);
    const lExpectedOutput = readFileSync(
      fileURLToPath(new URL("fixtures/dependencies.txt", import.meta.url)),
      "utf8"
    );

    expect(lResult.output).to.equal(lExpectedOutput);
    expect(lResult.exitCode).to.equal(0);
  });
});
