const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const defaultTheme = require("../../../../src/report/dot/common/defaultTheme.json");
const renderDot = require("../../../../src/report/dot/moduleLevel");
const deps = require("./mocks/richmodulecolor.json");
const boringTheme = require("./boringTheme.json");

const defaultColorFixture = fs.readFileSync(
  path.join(__dirname, "mocks/defaultmodulecolor.dot"),
  "utf8"
);
const boringColorFixture = fs.readFileSync(
  path.join(__dirname, "mocks/boringmodulecolor.dot"),
  "utf8"
);

describe("report/dot/moduleLevel reporter coloring", () => {
  it("richly colors when passed a rich color scheme", () => {
    expect(renderDot(deps, defaultTheme).output).to.deep.equal(
      defaultColorFixture
    );
  });
  it("defaultly colors when passed no color scheme", () => {
    expect(renderDot(deps).output).to.deep.equal(defaultColorFixture);
  });
  it("colors boringly when passed the boring color scheme", () => {
    expect(renderDot(deps, boringTheme).output).to.deep.equal(
      boringColorFixture
    );
  });
});
