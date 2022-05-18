import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.js";
import main from "../../src/main/index.js";
import { createRequireJSON } from "../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const esOut = requireJSON("./__mocks__/dynamic-imports/es/output.json");
const tsOut = requireJSON("./__mocks__/dynamic-imports/typescript/output.json");
const tsOutpre = requireJSON(
  "./__mocks__/dynamic-imports/typescript/output-pre-compilation-deps.json"
);

use(chaiJSONSchema);

const WORKING_DIRECTORY = process.cwd();

describe("[E] main.cruise - dynamic imports", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("detects dynamic dependencies in es", () => {
    process.chdir("test/main/__mocks__/dynamic-imports/es");
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
    process.chdir("test/main/__mocks__/dynamic-imports/typescript");
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
    process.chdir("test/main/__mocks__/dynamic-imports/typescript");
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
