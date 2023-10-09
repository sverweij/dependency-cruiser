import { deepEqual } from "node:assert/strict";
import Ajv from "ajv";
import { createRequireJSON } from "../backwards.utl.mjs";
import normBaseDirectory from "./norm-base-directory.utl.mjs";
import cruiseResultSchema from "#cruise-result-schema";
import cruise from "#main/cruise.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const output = normBaseDirectory(
  requireJSON("./__mocks__/type-only-module-references/output.json"),
);
const outputNoTS = normBaseDirectory(
  requireJSON("./__mocks__/type-only-module-references/output-no-ts.json"),
);

const ajv = new Ajv();

const WORKING_DIRECTORY = process.cwd();

describe("[E] main.cruise - type only module references", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("finds something that's only in node_modules/@types", async () => {
    process.chdir("test/main/__mocks__/type-only-module-references");

    const lResult = await cruise(
      ["src"],
      {
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true, resolveLicenses: true },
    );

    deepEqual(lResult.output, output);
    ajv.validate(cruiseResultSchema, lResult.output);
  });

  it("don't find it when not looking for pre-compilation deps", async () => {
    process.chdir("test/main/__mocks__/type-only-module-references");

    const lResult = await cruise(
      ["src"],
      {
        tsPreCompilationDeps: false,
      },
      { bustTheCache: true },
    );

    deepEqual(lResult.output, outputNoTS);
    ajv.validate(cruiseResultSchema, lResult.output);
  });
});
