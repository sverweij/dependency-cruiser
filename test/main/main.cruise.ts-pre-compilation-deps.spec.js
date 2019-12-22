const chai = require("chai");
const main = require("../../src/main");
const cruiseResultSchema = require("../../src/schema/cruise-result.schema.json");
const tsPreCompFixtureCJS = require("./fixtures/ts-precomp-cjs.json");
const tsPreCompFixtureES = require("./fixtures/ts-precomp-es.json");
const tsNoPrecompFixtureCJS = require("./fixtures/ts-no-precomp-cjs.json");
const tsNoPrecompFixtureES = require("./fixtures/ts-no-precomp-es.json");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

describe("main.cruise - tsPreCompilationDeps", () => {
  it("ts-pre-compilation-deps: on, target CJS", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/ts-precompilation-deps-on-cjs"],
      {
        tsConfig: {
          fileName: "test/main/fixtures/tsconfig.targetcjs.json"
        },
        tsPreCompilationDeps: true
      },
      { bustTheCache: true },
      {
        options: {
          baseUrl: ".",
          module: "commonjs"
        }
      }
    );

    expect(lResult.output).to.deep.equal(tsPreCompFixtureCJS);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("ts-pre-compilation-deps: on, target ES", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/ts-precompilation-deps-on-es"],
      {
        tsConfig: {
          fileName: "test/main/fixtures/tsconfig.targetes.json"
        },
        tsPreCompilationDeps: true
      },
      { bustTheCache: true },
      {
        options: {
          baseUrl: ".",
          module: "es6"
        }
      }
    );

    expect(lResult.output).to.deep.equal(tsPreCompFixtureES);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("ts-pre-compilation-deps: off, target CJS", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/ts-precompilation-deps-off-cjs"],
      {
        tsConfig: {
          fileName: "test/main/fixtures/tsconfig.targetcjs.json"
        },
        tsPreCompilationDeps: false
      },
      { bustTheCache: true },
      {
        options: {
          baseUrl: ".",
          module: "commonjs"
        }
      }
    );

    expect(lResult.output).to.deep.equal(tsNoPrecompFixtureCJS);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("ts-pre-compilation-deps: off, target ES", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/ts-precompilation-deps-off-es"],
      {
        tsConfig: {
          fileName: "test/main/fixtures/tsconfig.targetes.json"
        },
        tsPreCompilationDeps: false
      },
      { bustTheCache: true },
      {
        options: {
          baseUrl: ".",
          module: "es6"
        }
      }
    );

    expect(lResult.output).to.deep.equal(tsNoPrecompFixtureES);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
});
