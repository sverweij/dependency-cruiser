const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const render = require("../../../src/report/html");
const deps = require("./mocks/cjs-no-dependency-valid.json");

const elementFixture = fs.readFileSync(
  path.join(__dirname, "mocks", "cjs-no-dependency-valid.html"),
  "utf8"
);

describe("report/html reporter", () => {
  it("renders html - modules in the root don't come in a cluster; and one module could not be resolved", () => {
    const lReturnValue = render(deps);

    expect(lReturnValue.output).to.deep.equal(elementFixture);
    expect(lReturnValue.exitCode).to.equal(0);
  });
});

/* eslint max-len: 0 */
