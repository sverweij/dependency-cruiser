import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import { cruise } from "../../src/main/index.js";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.js";
import { createRequireJSON } from "../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const output = requireJSON("./__mocks__/type-only-imports/output.json");
const outputWithRules = requireJSON(
  "./__mocks__/type-only-imports/output-with-rules.json"
);

use(chaiJSONSchema);

const WORKING_DIRECTORY = process.cwd();

describe("[E] main.cruise - explicitly type only imports", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("classifies type only imports as type only in addition to their regular type", () => {
    process.chdir("test/main/__mocks__/type-only-imports");

    const lResult = cruise(
      ["src"],
      {
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true, resolveLicenses: false }
    );

    expect(lResult.output).to.deep.equal(output);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("flags type onlye imports when forbidden", () => {
    process.chdir("test/main/__mocks__/type-only-imports");

    const lResult = cruise(
      ["src"],
      {
        ruleSet: {
          forbidden: [
            {
              name: "no-type-only",
              from: {},
              to: {
                dependencyTypes: ["type-only"],
              },
            },
          ],
        },
        validate: true,
        tsPreCompilationDeps: true,
      },
      { bustTheCache: true, resolveLicenses: false }
    );

    expect(lResult.output).to.deep.equal(outputWithRules);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });
});
