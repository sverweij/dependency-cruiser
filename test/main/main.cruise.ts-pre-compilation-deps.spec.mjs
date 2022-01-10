import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.js";
import { cruise } from "../../src/main/index.js";
import { createRequireJSON } from "../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const tsPreCompFixtureCJS = requireJSON("./__fixtures__/ts-precomp-cjs.json");
const tsPreCompFixtureES = requireJSON("./__fixtures__/ts-precomp-es.json");
const tsNoPrecompFixtureCJS = requireJSON(
  "./__fixtures__/ts-no-precomp-cjs.json"
);
const tsNoPrecompFixtureES = requireJSON(
  "./__fixtures__/ts-no-precomp-es.json"
);

use(chaiJSONSchema);

describe("[E] main.cruise - tsPreCompilationDeps", () => {
  it("ts-pre-compilation-deps: on, target CJS", () => {
    const lResult = cruise(
      ["test/main/__mocks__/ts-precompilation-deps-on-cjs"],
      {
        tsConfig: {
          fileName: "test/main/__mocks__/tsconfig.targetcjs.json",
        },
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true },
      {
        options: {
          baseUrl: ".",
          module: "commonjs",
        },
      }
    );

    expect(lResult.output).to.deep.equal(tsPreCompFixtureCJS);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("ts-pre-compilation-deps: on, target ES", () => {
    const lResult = cruise(
      ["test/main/__mocks__/ts-precompilation-deps-on-es"],
      {
        tsConfig: {
          fileName: "test/main/__mocks__/tsconfig.targetes.json",
        },
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true },
      {
        options: {
          baseUrl: ".",
          module: "es6",
        },
      }
    );

    expect(lResult.output).to.deep.equal(tsPreCompFixtureES);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("ts-pre-compilation-deps: off, target CJS", () => {
    const lResult = cruise(
      ["test/main/__mocks__/ts-precompilation-deps-off-cjs"],
      {
        tsConfig: {
          fileName: "test/main/__mocks__/tsconfig.targetcjs.json",
        },
        tsPreCompilationDeps: false,
      },
      { bustTheCache: true },
      {
        options: {
          baseUrl: ".",
          module: "commonjs",
        },
      }
    );

    expect(lResult.output).to.deep.equal(tsNoPrecompFixtureCJS);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("ts-pre-compilation-deps: off, target ES", () => {
    const lResult = cruise(
      ["test/main/__mocks__/ts-precompilation-deps-off-es"],
      {
        tsConfig: {
          fileName: "test/main/__mocks__/tsconfig.targetes.json",
        },
        tsPreCompilationDeps: false,
      },
      { bustTheCache: true },
      {
        options: {
          baseUrl: ".",
          module: "es6",
        },
      }
    );

    expect(lResult.output).to.deep.equal(tsNoPrecompFixtureES);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
});
