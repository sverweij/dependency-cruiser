import { join } from "path";
import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import { cruise } from "../../src/main/index.js";
import normalizeOptions from "../../src/cli/normalize-cli-options.js";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.js";

use(chaiJSONSchema);

const WORKING_DIRECTORY = process.cwd();

describe("[E] main.cruise - reachable integration", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("finds the dead wood and the stuff isolated from one 'forbidden' rule set", () => {
    process.chdir(join("test", "main", "__mocks__", "reachables"));
    const lResult = JSON.parse(
      cruise(
        ["src"],
        normalizeOptions({
          config: "forbidden-dead-wood-and-isolation.js",
          outputType: "json",
        })
      ).output
    );
    expect(lResult.summary.violations).to.deep.equal([
      {
        type: "reachability",
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
        type: "module",
        from: "src/utilities/insula.js",
        to: "src/utilities/insula.js",
        rule: {
          severity: "info",
          name: "no-unreachable-from-root",
        },
      },
      {
        type: "module",
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
    process.chdir(join("test", "main", "__mocks__", "reachables"));
    const lResult = JSON.parse(
      cruise(
        ["src"],
        normalizeOptions({
          config: "allowed-dead-wood.js",
          outputType: "json",
        })
      ).output
    );

    expect(lResult.summary.violations).to.deep.equal([
      {
        type: "module",
        from: "src/utilities/insula.js",
        to: "src/utilities/insula.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
      {
        type: "module",
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
    process.chdir(join("test", "main", "__mocks__", "reachables"));
    const lResult = JSON.parse(
      cruise(
        ["src"],
        normalizeOptions({
          config: "allowed-isolation.js",
          outputType: "json",
        })
      ).output
    );

    expect(lResult.summary.violations).to.deep.equal([
      {
        type: "module",
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
