import { deepEqual } from "node:assert/strict";
import Ajv from "ajv";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.mjs";
import { createRequireJSON } from "../backwards.utl.mjs";
import normBaseDirectory from "./norm-base-directory.utl.mjs";
import cruise from "#main/cruise.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const tsPreCompFixtureCJS = normBaseDirectory(
  requireJSON("./__fixtures__/ts-precomp-cjs.json"),
);
const tsPreCompFixtureES = normBaseDirectory(
  requireJSON("./__fixtures__/ts-precomp-es.json"),
);
const tsNoPrecompFixtureCJS = normBaseDirectory(
  requireJSON("./__fixtures__/ts-no-precomp-cjs.json"),
);
const tsNoPrecompFixtureES = normBaseDirectory(
  requireJSON("./__fixtures__/ts-no-precomp-es.json"),
);

const ajv = new Ajv();

describe("[E] main.cruise - tsPreCompilationDeps", () => {
  it("ts-pre-compilation-deps: on, target CJS", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/ts-precompilation-deps-on-cjs"],
      {
        tsConfig: {
          fileName: "test/main/__mocks__/tsconfig.targetcjs.json",
        },
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true },
      {
        tsConfig: {
          options: {
            baseUrl: ".",
            module: "commonjs",
          },
        },
      },
    );

    deepEqual(lResult.output, tsPreCompFixtureCJS);
    ajv.validate(cruiseResultSchema, lResult.output);
  });
  it("ts-pre-compilation-deps: on, target ES", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/ts-precompilation-deps-on-es"],
      {
        tsConfig: {
          fileName: "test/main/__mocks__/tsconfig.targetes.json",
        },
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true },
      {
        tsConfig: {
          options: {
            baseUrl: ".",
            module: "es6",
          },
        },
      },
    );

    deepEqual(lResult.output, tsPreCompFixtureES);
    ajv.validate(cruiseResultSchema, lResult.output);
  });
  it("ts-pre-compilation-deps: off, target CJS", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/ts-precompilation-deps-off-cjs"],
      {
        tsConfig: {
          fileName: "test/main/__mocks__/tsconfig.targetcjs.json",
        },
        tsPreCompilationDeps: false,
      },
      { bustTheCache: true },
      {
        tsConfig: {
          options: {
            baseUrl: ".",
            module: "commonjs",
          },
        },
      },
    );

    deepEqual(lResult.output, tsNoPrecompFixtureCJS);
    ajv.validate(cruiseResultSchema, lResult.output);
  });
  it("ts-pre-compilation-deps: off, target ES", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/ts-precompilation-deps-off-es"],
      {
        tsConfig: {
          fileName: "test/main/__mocks__/tsconfig.targetes.json",
        },
        tsPreCompilationDeps: false,
      },
      { bustTheCache: true },
      {
        tsConfig: {
          options: {
            baseUrl: ".",
            module: "es6",
          },
        },
      },
    );

    deepEqual(lResult.output, tsNoPrecompFixtureES);
    ajv.validate(cruiseResultSchema, lResult.output);
  });
});
