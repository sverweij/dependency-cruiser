const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const render = require("../../../../src/report/dot")("custom");
const deps = require("./mocks/dependency-cruiser-2020-01-25");
const orphans = require("./mocks/orphans.json");
const rxjs = require("./mocks/rxjs.json");

const mockFolder = path.join(__dirname, "mocks");
const consolidatedDot = fs.readFileSync(
  path.join(mockFolder, "dependency-cruiser-2020-01-25.dot"),
  "utf8"
);
const consolidatedOrphansDot = fs.readFileSync(
  path.join(mockFolder, "orphans.dot"),
  "utf8"
);
const consolidatedRxJs = fs.readFileSync(
  path.join(mockFolder, "rxjs.dot"),
  "utf8"
);

describe("report/dot/custom-level reporter", () => {
  it("consolidates to custome levels", () => {
    const lReturnValue = render(deps);

    expect(lReturnValue.output).to.deep.equal(consolidatedDot);
    expect(lReturnValue.exitCode).to.equal(0);
  });

  it("consolidates module only transgressions correctly", () => {
    const lReturnValue = render(orphans);

    expect(lReturnValue.output).to.deep.equal(consolidatedOrphansDot);
    expect(lReturnValue.exitCode).to.equal(0);
  });

  it("consolidates a slightly larger code base in a timely fashion", () => {
    const lReturnValue = render(rxjs);

    expect(lReturnValue.output).to.deep.equal(consolidatedRxJs);
    expect(lReturnValue.exitCode).to.equal(0);
  });
});

/* eslint max-len: 0 */
