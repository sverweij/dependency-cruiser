import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { expect } from "chai";
import renderText from "../../../src/report/text.js";
import dependencies from "./__mocks__/dependencies.mjs";

describe("[I] report/text", () => {
  it("renders a bunch of dependencies", () => {
    const lResult = renderText(dependencies);
    const lExpectedOutput = readFileSync(
      fileURLToPath(new URL("__fixtures__/dependencies.txt", import.meta.url)),
      "utf8"
    );

    expect(lResult.output).to.equal(lExpectedOutput);
    expect(lResult.exitCode).to.equal(0);
  });
});
