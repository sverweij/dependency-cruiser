import { posix as path } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import pathToPosix from "../../src/extract/utl/path-to-posix.js";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.js";
import main from "../../src/main/index.js";
import { createRequireJSON } from "../backwards.utl.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const requireJSON = createRequireJSON(import.meta.url);

const tsFixture = requireJSON("./__fixtures__/ts.json");
const tsxFixture = requireJSON("./__fixtures__/tsx.json");
const jsxFixture = requireJSON("./__fixtures__/jsx.json");
const jsxAsObjectFixture = requireJSON("./__fixtures__/jsx-as-object.json");

use(chaiJSONSchema);

function pathPosixify(pOutput) {
  const lReturnValue = { ...pOutput };
  lReturnValue.summary.optionsUsed.args = pathToPosix(
    lReturnValue.summary.optionsUsed.args
  );
  return lReturnValue;
}

describe("[E] main.cruise", () => {
  it("Returns an object when no options are passed", () => {
    const lResult = main.cruise(["test/main/__mocks__/ts"]);

    expect(pathPosixify(lResult.output)).to.deep.equal(tsFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("Returns an object when no options are passed (absolute path)", () => {
    const lResult = main.cruise(
      [path.join(__dirname, "__mocks__", "ts")],
      {},
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(tsFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("Also processes tsx correctly", () => {
    const lResult = main.cruise(
      ["test/main/__mocks__/tsx"],
      {},
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(tsxFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("And jsx", () => {
    const lResult = main.cruise(
      ["test/main/__mocks__/jsx"],
      {},
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(jsxFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("And rulesets in the form a an object instead of json", () => {
    const lResult = main.cruise(
      ["test/main/__mocks__/jsx"],
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
      ["test/main/__mocks__/collapse-after-cruise"],
      {
        ruleSet: {},
        collapse: "^test/main/__mocks__/collapse-after-cruise/src/[^/]+",
      },
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(
      JSON.parse(
        readFileSync(
          "test/main/__mocks__/collapse-after-cruise/expected-result.json",
          "utf8"
        )
      )
    );
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
});
