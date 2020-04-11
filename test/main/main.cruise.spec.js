const path = require("path").posix;
const chai = require("chai");
const main = require("../../src/main");
const cruiseResultSchema = require("../../src/schema/cruise-result.schema.json");
const tsFixture = require("./fixtures/ts.json");
const tsxFixture = require("./fixtures/tsx.json");
const jsxFixture = require("./fixtures/jsx.json");
const jsxAsObjectFixture = require("./fixtures/jsx-as-object.json");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

describe("main.cruise", () => {
  it("Returns an object when no options are passed", () => {
    const lResult = main.cruise(["test/main/fixtures/ts"]);

    expect(lResult.output).to.deep.equal(tsFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("Returns an object when no options are passed (absolute path)", () => {
    const lResult = main.cruise(
      [path.join(__dirname, "fixtures", "ts")],
      {},
      { bustTheCache: true }
    );

    expect(lResult.output).to.deep.equal(tsFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("Also processes tsx correctly", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/tsx"],
      {},
      { bustTheCache: true }
    );

    expect(lResult.output).to.deep.equal(tsxFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("And jsx", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/jsx"],
      {},
      { bustTheCache: true }
    );

    expect(lResult.output).to.deep.equal(jsxFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("And rulesets in the form a an object instead of json", () => {
    const lResult = main.cruise(
      ["test/main/fixtures/jsx"],
      {
        ruleSet: {}
      },
      { bustTheCache: true }
    );

    expect(lResult.output).to.deep.equal(jsxAsObjectFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
});
