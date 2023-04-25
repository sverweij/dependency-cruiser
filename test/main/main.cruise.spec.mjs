import { posix as path } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import pathToPosix from "../../src/utl/path-to-posix.mjs";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.mjs";
import cruise from "../../src/main/cruise.mjs";
import { createRequireJSON } from "../backwards.utl.mjs";
import normBaseDirectory from "./norm-base-directory.utl.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const requireJSON = createRequireJSON(import.meta.url);

const tsFixture = normBaseDirectory(requireJSON("./__fixtures__/ts.json"));
const tsxFixture = normBaseDirectory(requireJSON("./__fixtures__/tsx.json"));
const jsxFixture = normBaseDirectory(requireJSON("./__fixtures__/jsx.json"));
const jsxAsObjectFixture = normBaseDirectory(
  requireJSON("./__fixtures__/jsx-as-object.json")
);

use(chaiJSONSchema);

function pathPosixify(pOutput) {
  const lReturnValue = { ...pOutput };
  lReturnValue.summary.optionsUsed.args = pathToPosix(
    lReturnValue.summary.optionsUsed.args
  );
  return lReturnValue;
}

describe("[E] main.cruise - main", () => {
  it("Returns an object when no options are passed", async () => {
    const lResult = await cruise(["test/main/__mocks__/ts"]);

    expect(pathPosixify(lResult.output)).to.deep.equal(tsFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("Returns an object when no options are passed (absolute path)", async () => {
    const lResult = await cruise(
      [path.join(__dirname, "__mocks__", "ts")],
      {},
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(tsFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("processes tsx correctly", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/tsx"],
      {},
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(tsxFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("processes jsx correctly", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/jsx"],
      {},
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(jsxFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("process rulesets in the form a an object instead of json", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/jsx"],
      {
        ruleSet: {},
      },
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(jsxAsObjectFixture);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
  it("Collapses to a pattern when a collapse pattern is passed", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/collapse-after-cruise"],
      {
        ruleSet: {},
        collapse: "^test/main/__mocks__/collapse-after-cruise/src/[^/]+",
      },
      { bustTheCache: true }
    );

    expect(pathPosixify(lResult.output)).to.deep.equal(
      normBaseDirectory(
        JSON.parse(
          readFileSync(
            "test/main/__mocks__/collapse-after-cruise/expected-result.json",
            "utf8"
          )
        )
      )
    );
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
});
