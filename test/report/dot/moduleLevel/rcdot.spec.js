const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const RCScheme = require("../../../../src/report/dot/common/richModuleColorScheme.json");
const renderDot = require("../../../../src/report/dot/moduleLevel");
const deps = require("./mocks/richmodulecolor.json");
const boringScheme = require("./boringModuleColorScheme.json");

const richColorFixture = fs.readFileSync(
  path.join(__dirname, "mocks/richmodulecolor.dot"),
  "utf8"
);
const boringColorFixture = fs.readFileSync(
  path.join(__dirname, "mocks/defaultmodulecolor.dot"),
  "utf8"
);

describe("report/dot reporter coloring", () => {
  it("richly colors when passed a rich color scheme", () => {
    expect(renderDot(deps, RCScheme).output).to.deep.equal(richColorFixture);
  });
  it("defaultly colors when passed no color scheme", () => {
    expect(renderDot(deps).output).to.deep.equal(richColorFixture);
  });
  it("colors boringly when passed the boring color scheme", () => {
    expect(renderDot(deps, boringScheme).output).to.deep.equal(
      boringColorFixture
    );
  });
});
