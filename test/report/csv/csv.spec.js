const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const render = require("../../../src/report/csv");
const deps = require("./mocks/cjs-no-dependency-valid.json");

const elFixture = fs.readFileSync(
  path.join(__dirname, "mocks", "cjs-no-dependency-valid.csv"),
  "utf8"
);

describe("report/csv reporter", () => {
  it("renders csv", () => {
    const lRetval = render(deps);

    expect(lRetval.output).to.deep.equal(elFixture);
    expect(lRetval.exitCode).to.equal(0);
  });
});

/* eslint max-len: 0 */
