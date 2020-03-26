const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const renderText = require("../../../src/report/text");
const dependencies = require("./mocks/dependencies.json");

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
