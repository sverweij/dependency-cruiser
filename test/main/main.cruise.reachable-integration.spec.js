const path = require("path");
const chai = require("chai");
const main = require("~/src/main");
const normalizeOptions = require("~/src/cli/normalize-options");
const cruiseResultSchema = require("~/src/schema/cruise-result.schema.json");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

const WORKING_DIRECTORY = process.cwd();

describe("main.cruise - reachable integration", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("finds the dead wood and the stuff isolated from one 'forbidden' rule set", () => {
    process.chdir(path.join("test", "main", "fixtures", "reachables"));
    const lResult = JSON.parse(
      main.cruise(
        ["src"],
        normalizeOptions({
          config: "forbidden-dead-wood-and-isolation.js",
          outputType: "json",
        })
      ).output
    );
    expect(lResult.summary.violations).to.deep.equal([
      {
        from: "src/schema-declarations/naughty.info.js",
        to: "src/db/admin.js",
        rule: {
          severity: "warn",
          name: "no-db-access-from-schemas",
        },
        via: [
          "src/schema-declarations/naughty.info.js",
          "src/utilities/plumbing.js",
          "src/db/admin.js",
        ],
      },
      {
        from: "src/utilities/insula.js",
        to: "src/utilities/insula.js",
        rule: {
          severity: "info",
          name: "no-unreachable-from-root",
        },
      },
      {
        from: "src/utilities/pen.js",
        to: "src/utilities/pen.js",
        rule: {
          severity: "info",
          name: "no-unreachable-from-root",
        },
      },
    ]);
    expect(lResult).to.be.jsonSchema(cruiseResultSchema);
  });

  it("finds the dead wood from an 'allowed' rule set", () => {
    process.chdir(path.join("test", "main", "fixtures", "reachables"));
    const lResult = JSON.parse(
      main.cruise(
        ["src"],
        normalizeOptions({
          config: "allowed-dead-wood.js",
          outputType: "json",
        })
      ).output
    );

    expect(lResult.summary.violations).to.deep.equal([
      {
        from: "src/utilities/insula.js",
        to: "src/utilities/insula.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
      {
        from: "src/utilities/pen.js",
        to: "src/utilities/pen.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
    ]);
    expect(lResult).to.be.jsonSchema(cruiseResultSchema);
  });
  it("finds the stuff that needs to be isolated from an 'allowed' rule set", () => {
    process.chdir(path.join("test", "main", "fixtures", "reachables"));
    const lResult = JSON.parse(
      main.cruise(
        ["src"],
        normalizeOptions({
          config: "allowed-isolation.js",
          outputType: "json",
        })
      ).output
    );

    expect(lResult.summary.violations).to.deep.equal([
      {
        from: "src/db/admin.js",
        to: "src/db/admin.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
    ]);
    expect(lResult).to.be.jsonSchema(cruiseResultSchema);
  });
});
