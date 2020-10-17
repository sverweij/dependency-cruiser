const chai = require("chai");
const cruiseResultSchema = require("../../src/schema/cruise-result.schema.json");
const main = require("../../src/main");
const esOut = require("./fixtures/dynamic-imports/es/output.json");
const tsOut = require("./fixtures/dynamic-imports/typescript/output.json");
const tsOutpre = require("./fixtures/dynamic-imports/typescript/output-pre-compilation-deps.json");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

const WORKING_DIRECTORY = process.cwd();

describe("main.cruise - dynamic imports", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("detects dynamic dependencies in es", () => {
    process.chdir("test/main/fixtures/dynamic-imports/es");
    const lResult = main.cruise(
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

    expect(lResult.output).to.deep.equal(esOut);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("detects dynamic dependencies in typescript", () => {
    process.chdir("test/main/fixtures/dynamic-imports/typescript");
    const lResult = main.cruise(
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

    expect(lResult.output).to.deep.equal(tsOut);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("detects dynamic dependencies in typescript when using tsPreCompilationDeps", () => {
    process.chdir("test/main/fixtures/dynamic-imports/typescript");
    const lResult = main.cruise(
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

    expect(lResult.output).to.deep.equal(tsOutpre);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
});
