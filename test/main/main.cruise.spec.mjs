import { deepEqual } from "node:assert/strict";
import { posix as path } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequireJSON } from "../backwards.utl.mjs";
import normBaseDirectory from "./norm-base-directory.utl.mjs";
import { validate as validateCruiseResult } from "#schema/cruise-result.validate.mjs";
import cruise from "#main/cruise.mjs";
import pathToPosix from "#utl/path-to-posix.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const requireJSON = createRequireJSON(import.meta.url);

const tsFixture = normBaseDirectory(requireJSON("./__fixtures__/ts.json"));
const tsxFixture = normBaseDirectory(requireJSON("./__fixtures__/tsx.json"));
const jsxFixture = normBaseDirectory(requireJSON("./__fixtures__/jsx.json"));
const jsxAsObjectFixture = normBaseDirectory(
  requireJSON("./__fixtures__/jsx-as-object.json"),
);

function pathPosixify(pOutput) {
  const lReturnValue = { ...pOutput };
  lReturnValue.summary.optionsUsed.args = pathToPosix(
    lReturnValue.summary.optionsUsed.args,
  );
  return lReturnValue;
}

describe("[E] main.cruise - main", () => {
  it("Returns an object when no options are passed", async () => {
    const lResult = await cruise(["test/main/__mocks__/ts"]);

    validateCruiseResult(lResult.output);
    lResult.output.summary.environment = {};
    deepEqual(pathPosixify(lResult.output), tsFixture);
  });

  it("Returns an object when no options are passed (absolute path)", async () => {
    const lResult = await cruise(
      [path.join(__dirname, "__mocks__", "ts")],
      {},
      { bustTheCache: true },
    );

    validateCruiseResult(lResult.output);
    lResult.output.summary.environment = {};
    deepEqual(pathPosixify(lResult.output), tsFixture);
  });

  it("processes tsx correctly", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/tsx"],
      {},
      { bustTheCache: true },
    );

    validateCruiseResult(lResult.output);
    lResult.output.summary.environment = {};
    deepEqual(pathPosixify(lResult.output), tsxFixture);
  });

  it("processes jsx correctly", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/jsx"],
      {},
      { bustTheCache: true },
    );

    validateCruiseResult(lResult.output);
    lResult.output.summary.environment = {};
    deepEqual(pathPosixify(lResult.output), jsxFixture);
  });
  it("process rulesets in the form a an object instead of json", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/jsx"],
      {
        ruleSet: {},
      },
      { bustTheCache: true },
    );

    validateCruiseResult(lResult.output);
    lResult.output.summary.environment = {};
    deepEqual(pathPosixify(lResult.output), jsxAsObjectFixture);
  });
  it("Collapses to a pattern when a collapse pattern is passed", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/collapse-after-cruise"],
      {
        ruleSet: {},
        collapse: "^test/main/__mocks__/collapse-after-cruise/src/[^/]+",
      },
      { bustTheCache: true },
    );

    validateCruiseResult(lResult.output);
    lResult.output.summary.environment = {};
    deepEqual(
      pathPosixify(lResult.output),
      normBaseDirectory(
        JSON.parse(
          readFileSync(
            "test/main/__mocks__/collapse-after-cruise/expected-result.json",
            "utf8",
          ),
        ),
      ),
    );
  });
});
