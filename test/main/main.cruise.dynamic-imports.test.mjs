import { deepStrictEqual } from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import Ajv from "ajv";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.mjs";
import cruise from "../../src/main/cruise.mjs";
import { createRequireJSON } from "../backwards.utl.mjs";
import normBaseDirectory from "./norm-base-directory.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const esOut = normBaseDirectory(
  requireJSON("./__mocks__/dynamic-imports/es/output.json")
);
const tsOut = normBaseDirectory(
  requireJSON("./__mocks__/dynamic-imports/typescript/output.json")
);
const tsOutpre = normBaseDirectory(
  requireJSON(
    "./__mocks__/dynamic-imports/typescript/output-pre-compilation-deps.json"
  )
);

const ajv = new Ajv();

const WORKING_DIRECTORY = process.cwd();

describe("[E] main.cruise - dynamic imports", () => {
  beforeEach(() => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach(() => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("detects dynamic dependencies in es", async () => {
    process.chdir("test/main/__mocks__/dynamic-imports/es");
    const lResult = await cruise(
      ["src"],
      {
        ruleSet: {
          forbidden: [
            {
              name: "no-circular",
              severity: "info",
              from: {},
              to: {
                dynamic: false,
                circular: true,
              },
            },
            {
              name: "no-dynamic",
              severity: "warn",
              from: {},
              to: {
                dynamic: true,
              },
            },
          ],
        },
        validate: true,
      },
      { bustTheCache: true }
    );

    deepStrictEqual(lResult.output, esOut);
    ajv.validate(cruiseResultSchema, lResult.output);
  });

  it("detects dynamic dependencies in typescript", async () => {
    process.chdir("test/main/__mocks__/dynamic-imports/typescript");
    const lResult = await cruise(
      ["src"],
      {
        ruleSet: {
          forbidden: [
            {
              name: "no-circular",
              severity: "info",
              from: {},
              to: {
                dynamic: false,
                circular: true,
              },
            },
            {
              name: "no-dynamic",
              severity: "warn",
              from: {},
              to: {
                dynamic: true,
              },
            },
          ],
        },
        validate: true,
      },
      { bustTheCache: true }
    );

    deepStrictEqual(lResult.output, tsOut);
    ajv.validate(cruiseResultSchema, lResult.output);
  });

  it("detects dynamic dependencies in typescript when using tsPreCompilationDeps", async () => {
    process.chdir("test/main/__mocks__/dynamic-imports/typescript");
    const lResult = await cruise(
      ["src"],
      {
        ruleSet: {
          forbidden: [
            {
              name: "no-circular",
              severity: "info",
              from: {},
              to: {
                dynamic: false,
                circular: true,
              },
            },
            {
              name: "no-dynamic",
              severity: "warn",
              from: {},
              to: {
                dynamic: true,
              },
            },
          ],
        },
        validate: true,
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true }
    );

    deepStrictEqual(lResult.output, tsOutpre);
    ajv.validate(cruiseResultSchema, lResult.output);
  });
});
