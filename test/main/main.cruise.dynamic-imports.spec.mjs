import { deepEqual } from "node:assert/strict";
import { createRequireJSON } from "../backwards.utl.mjs";
import normBaseDirectory from "./norm-base-directory.utl.mjs";
import { validate as validateCruiseResult } from "#schema/cruise-result.validate.mjs";
import cruise from "#main/cruise.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const esOut = normBaseDirectory(
  requireJSON("./__mocks__/dynamic-imports/es/output.json"),
);
const tsOut = normBaseDirectory(
  requireJSON("./__mocks__/dynamic-imports/typescript/output.json"),
);
const tsOutpre = normBaseDirectory(
  requireJSON(
    "./__mocks__/dynamic-imports/typescript/output-pre-compilation-deps.json",
  ),
);

const WORKING_DIRECTORY = process.cwd();

describe("[E] main.cruise - dynamic imports", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
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
      { bustTheCache: true },
    );

    deepEqual(lResult.output, esOut);
    validateCruiseResult(lResult.output);
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
      { bustTheCache: true },
    );

    validateCruiseResult(lResult.output);

    deepEqual(lResult.output, tsOut);
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
      { bustTheCache: true },
    );

    validateCruiseResult(lResult.output);
    deepEqual(lResult.output, tsOutpre);
  });
});
