import { deepStrictEqual } from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import Ajv from "ajv";
import cruise from "../../src/main/cruise.mjs";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.mjs";
import { createRequireJSON } from "../backwards.utl.mjs";
import normBaseDirectory from "./norm-base-directory.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const output = normBaseDirectory(
  requireJSON("./__mocks__/type-only-imports/output.json")
);
const outputWithRules = normBaseDirectory(
  requireJSON("./__mocks__/type-only-imports/output-with-rules.json")
);

const ajv = new Ajv();

const WORKING_DIRECTORY = process.cwd();

describe("[E] main.cruise - explicitly type only imports", () => {
  beforeEach(() => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach(() => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("classifies type only imports as type only in addition to their regular type", async () => {
    process.chdir("test/main/__mocks__/type-only-imports");

    const lResult = await cruise(
      ["src"],
      {
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true, resolveLicenses: false }
    );

    deepStrictEqual(lResult.output, output);
    ajv.validate(cruiseResultSchema, lResult.output);
  });

  it("flags type only imports when forbidden", async () => {
    process.chdir("test/main/__mocks__/type-only-imports");

    const lResult = await cruise(
      ["src"],
      {
        ruleSet: {
          forbidden: [
            {
              name: "no-type-only",
              from: {},
              to: {
                dependencyTypes: ["type-only"],
              },
            },
          ],
        },
        validate: true,
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true, resolveLicenses: false }
    );

    deepStrictEqual(lResult.output, outputWithRules);
    ajv.validate(cruiseResultSchema, lResult.output);
  });
});
