const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const render = require("../../../src/report/csv");
const deps = require("./mocks/cjs-no-dependency-valid.json");

const elementFixture = fs.readFileSync(
  path.join(__dirname, "mocks", "cjs-no-dependency-valid.csv"),
  "utf8"
);

describe("report/csv reporter", () => {
  it("renders csv", () => {
    const lReturnValue = render(deps);

    expect(lReturnValue.output).to.deep.equal(elementFixture);
    expect(lReturnValue.exitCode).to.equal(0);
  });
});

/* eslint max-len: 0 */
