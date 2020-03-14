const chai = require("chai");
const main = require("../../src/main");
const cruiseResultSchema = require("../../src/schema/cruise-result.schema.json");
const output = require("./fixtures/type-only-module-references/output.json");
const outputNoTS = require("./fixtures/type-only-module-references/output-no-ts.json");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

const WORKING_DIRECTORY = process.cwd();

describe("main.cruise - type only module references", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("finds something that's only in node_modules/@types", () => {
    process.chdir("test/main/fixtures/type-only-module-references");

    const lResult = main.cruise(
      ["src"],
      {
        tsPreCompilationDeps: true
      },
      { bustTheCache: true }
    );

    expect(lResult.output).to.deep.equal(output);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("don't find it when not looking for pre-compilation deps", () => {
    process.chdir("test/main/fixtures/type-only-module-references");

    const lResult = main.cruise(
      ["src"],
      {
        tsPreCompilationDeps: false
      },
      { bustTheCache: true }
    );

    expect(lResult.output).to.deep.equal(outputNoTS);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
});
