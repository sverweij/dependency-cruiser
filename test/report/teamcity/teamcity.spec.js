const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const render = require("../../../src/report/teamcity");
const okdeps = require("./mocks/everything-fine.json");
const moduleErrs = require("./mocks/module-errors.json");
const circulars = require("./mocks/circular-deps.json");
const vias = require("./mocks/via-deps.json");

function removePerSessionAttributes(pString) {
  return pString.replace(/ flowId='[^']+' timestamp='[^']+'/g, "");
}

describe("report/teamcity", () => {
  it("says everything fine when everything is fine", () => {
    const lFixture = fs.readFileSync(
      path.join(__dirname, "mocks", "everything-fine-teamcity-format.txt"),
      "utf8"
    );
    const lResult = render(okdeps);

    expect(removePerSessionAttributes(lResult.output)).to.equal(lFixture);
    expect(lResult.exitCode).to.equal(0);
  });

  it("renders module only transgressions", () => {
    const lFixture = fs.readFileSync(
      path.join(__dirname, "mocks", "module-errors-teamcity-format.txt"),
      "utf8"
    );
    const lResult = render(moduleErrs);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(5);
  });

  it("renders circular transgressions", () => {
    const lFixture = fs.readFileSync(
      path.join(__dirname, "mocks", "circular-deps-teamcity-format.txt"),
      "utf8"
    );
    const lResult = render(circulars);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(3);
  });

  it("renders via transgressions", () => {
    const lFixture = fs.readFileSync(
      path.join(__dirname, "mocks", "via-deps-teamcity-format.txt"),
      "utf8"
    );
    const lResult = render(vias);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(4);
  });
});
