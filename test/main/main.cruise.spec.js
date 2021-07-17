const path = require("path").posix;
const fs = require("fs");
const chai = require("chai");
const pathToPosix = require("../../src/extract/utl/path-to-posix");
const cruiseResultSchema = require("../../src/schema/cruise-result.schema.js");
const main = require("../../src/main");
const tsFixture = require("./fixtures/ts.json");
const tsxFixture = require("./fixtures/tsx.json");
const jsxFixture = require("./fixtures/jsx.json");
const jsxAsObjectFixture = require("./fixtures/jsx-as-object.json");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

function pathPosixify(pOutput) {
  const lReturnValue = { ...pOutput };
  lReturnValue.summary.optionsUsed.args = pathToPosix(
    lReturnValue.summary.optionsUsed.args
  );
  return lReturnValue;
}

describe("main.cruise", () => {
  it("Returns an object when no options are passed", () => {
    const lResult = main.cruise(["test/main/fixtures/ts"]);

    expect(pathPosixify(lResult.output)).to.deep.equal(tsFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("Returns an object when no options are passed (absolute path)", () => {
    const lResult = main.cruise(
      [path.join(__dirname, "fixtures", "ts")],
      {},
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(tsFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("Also processes tsx correctly", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/tsx"],
      {},
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(tsxFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("And jsx", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/jsx"],
      {},
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(jsxFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("And rulesets in the form a an object instead of json", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/jsx"],
      {
        ruleSet: {},
      },
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(jsxAsObjectFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("Collapses to a pattern when a collapse pattern is passed", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/collapse-after-cruise"],
      {
        ruleSet: {},
        collapse: "^test/main/fixtures/collapse-after-cruise/src/[^/]+",
      },
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(
      JSON.parse(
        fs.readFileSync(
          "test/main/fixtures/collapse-after-cruise/expected-result.json",
          "utf8"
        )
      )
    );
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
});
