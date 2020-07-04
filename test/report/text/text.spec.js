const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const dependencies = require("./mocks/dependencies.json");
const renderText = require("~/src/report/text");

describe("report/text", () => {
  it("renders a bunch of dependencies", () => {
    const lResult = renderText(dependencies);
    const lExpectedOutput = fs.readFileSync(
      path.join(__dirname, "fixtures", "dependencies.txt"),
      "utf8"
    );

    expect(lResult.output).to.equal(lExpectedOutput);
    expect(lResult.exitCode).to.equal(0);
  });
});
