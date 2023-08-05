import { deepStrictEqual } from "node:assert";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import Ajv from "ajv";
import cruise from "../../src/main/cruise.mjs";
import normalizeOptions from "../../src/cli/normalize-cli-options.mjs";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.mjs";

const ajv = new Ajv();

const WORKING_DIRECTORY = process.cwd();

describe("[E] main.cruise - reachable integration", () => {
  beforeEach(() => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach(() => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("finds the dead wood and the stuff isolated from one 'forbidden' rule set", async () => {
    process.chdir(join("test", "main", "__mocks__", "reachables"));
    const lCruiseResult = await cruise(
      ["src"],
      await normalizeOptions({
        config: "forbidden-dead-wood-and-isolation.js",
        outputType: "json",
      })
    );
    const lResult = JSON.parse(lCruiseResult.output);
    deepStrictEqual(lResult.summary.violations, [
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
    ajv.validate(cruiseResultSchema, lResult);
  });

  it("finds the dead wood from an 'allowed' rule set", async () => {
    process.chdir(join("test", "main", "__mocks__", "reachables"));
    const lCruiseResult = await cruise(
      ["src"],
      await normalizeOptions({
        config: "allowed-dead-wood.js",
        outputType: "json",
      })
    );
    const lResult = JSON.parse(lCruiseResult.output);

    deepStrictEqual(lResult.summary.violations, [
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
    ajv.validate(cruiseResultSchema, lResult);
  });

  it("finds the stuff that needs to be isolated from an 'allowed' rule set", async () => {
    process.chdir(join("test", "main", "__mocks__", "reachables"));
    const lCruiseResult = await cruise(
      ["src"],
      await normalizeOptions({
        config: "allowed-isolation.js",
        outputType: "json",
      })
    );

    const lResult = JSON.parse(lCruiseResult.output);

    deepStrictEqual(lResult.summary.violations, [
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
    ajv.validate(cruiseResultSchema, lResult);
  });
});
