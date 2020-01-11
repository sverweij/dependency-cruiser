const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const render = require("../../../../src/report/dot")("folder");
const deps = require("./mocks/dependency-cruiser-2019-01-14.json");
const orphans = require("./mocks/orphans.json");
const rxjs = require("./mocks/rxjs.json");

const mockFolder = path.join(__dirname, "mocks");
const consolidatedDot = fs.readFileSync(
  path.join(mockFolder, "dependency-cruiser-2019-01-14.dot"),
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

describe("report/dot/folderLevel reporter", () => {
  it("consolidates to folder level", () => {
    const lRetval = render(deps);

    expect(lRetval.output).to.deep.equal(consolidatedDot);
    expect(lRetval.exitCode).to.equal(0);
  });

  it("consolidates module only transgressions correctly", () => {
    const lRetval = render(orphans);

    expect(lRetval.output).to.deep.equal(consolidatedOrphansDot);
    expect(lRetval.exitCode).to.equal(0);
  });

  it("consolidates a slightly larger code base in a timely fashion", () => {
    const lRetval = render(rxjs);

    expect(lRetval.output).to.deep.equal(consolidatedRxJs);
    expect(lRetval.exitCode).to.equal(0);
  });
});

/* eslint max-len: 0 */
