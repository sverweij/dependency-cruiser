import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import { cruise } from "../../src/main/index.js";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.js";
import { createRequireJSON } from "../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const output = requireJSON(
  "./fixtures/type-only-module-references/output.json"
);
const outputNoTS = requireJSON(
  "./fixtures/type-only-module-references/output-no-ts.json"
);

use(chaiJSONSchema);

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

    const lResult = cruise(
      ["src"],
      {
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true, resolveLicenses: true }
    );

    expect(lResult.output).to.deep.equal(output);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("don't find it when not looking for pre-compilation deps", () => {
    process.chdir("test/main/fixtures/type-only-module-references");

    const lResult = cruise(
      ["src"],
      {
        tsPreCompilationDeps: false,
      },
      { bustTheCache: true }
    );

    expect(lResult.output).to.deep.equal(outputNoTS);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
});
