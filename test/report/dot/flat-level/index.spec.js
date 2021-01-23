const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const render = require("../../../../src/report/dot")("flat");
const deps = require("./mocks/dependency-cruiser-2020-01-25");
const orphans = require("./mocks/orphans.json");
const rxjs = require("./mocks/rxjs.json");

const mockFolder = path.join(__dirname, "mocks");
const flatDot = fs.readFileSync(
  path.join(mockFolder, "dependency-cruiser-2020-01-25.dot"),
  "utf8"
);
const flatOrphansDot = fs.readFileSync(
  path.join(mockFolder, "orphans.dot"),
  "utf8"
);
const flatRxJs = fs.readFileSync(path.join(mockFolder, "rxjs.dot"), "utf8");

describe("report/dot/flat-level reporter", () => {
  it("consolidates to flat levels", () => {
    const lReturnValue = render(deps);

    expect(lReturnValue.output).to.deep.equal(flatDot);
    expect(lReturnValue.exitCode).to.equal(0);
  });

  it("consolidates module only transgressions correctly", () => {
    const lReturnValue = render(orphans);

    expect(lReturnValue.output).to.deep.equal(flatOrphansDot);
    expect(lReturnValue.exitCode).to.equal(0);
  });

  it("consolidates a slightly larger code base in a timely fashion", () => {
    const lReturnValue = render(rxjs);

    expect(lReturnValue.output).to.deep.equal(flatRxJs);
    expect(lReturnValue.exitCode).to.equal(0);
  });
});

/* eslint max-len: 0 */
