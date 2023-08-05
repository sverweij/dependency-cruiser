/* eslint-disable no-magic-numbers */
import { deepStrictEqual, ok, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import format from "../../src/main/format.mjs";
import { createRequireJSON } from "../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);
const cruiseResult = requireJSON(
  "./__mocks__/cruise-results-dc-2020-08-30-src-cli.json"
);

const MINIMAL_RESULT = {
  modules: [],
  summary: {
    violations: [],
    error: 0,
    warn: 0,
    info: 0,
    ignore: 0,
    totalCruised: 0,
    totalDependenciesCruised: 0,
    optionsUsed: {
      args: "",
      outputType: "json",
    },
  },
};

describe("[E] main.format - format", () => {
  it("barfs when it gets an invalid output type", async () => {
    let lErrorMessage = "none";
    try {
      await format({}, { outputType: "not-a-valid-reporter" });
    } catch (pError) {
      lErrorMessage = pError.message;
    }
    ok(
      lErrorMessage.includes(
        "'not-a-valid-reporter' is not a valid output type."
      )
    );
  });

  it("barfs when it gets a result passed that is invalid json", async () => {
    let lErrorMessage = "none";
    try {
      await format("that is no json");
    } catch (pError) {
      lErrorMessage = pError.message;
    }
    ok(
      lErrorMessage.includes(
        "The supplied dependency-cruiser result is not valid:"
      )
    );
  });

  it("barfs when it gets a result passed that doesn't comply to the result schema", async () => {
    let lErrorMessage = "none";
    try {
      await format({ valid: "JSON", not: "schema compliant though" });
    } catch (pError) {
      lErrorMessage = pError.message;
    }
    ok(
      lErrorMessage.includes(
        "The supplied dependency-cruiser result is not valid: data must have required property 'summary'"
      )
    );
  });

  it("returns an error reporter formatted report when presented with a legal result", async () => {
    const lResult = await format(MINIMAL_RESULT, { outputType: "err" });
    ok(
      lResult.output.includes(
        "no dependency violations found (0 modules, 0 dependencies cruised)"
      )
    );
  });

  it("returns an json reporter formatted report when presented with a legal result", async () => {
    const lResult = await format(MINIMAL_RESULT, { outputType: "json" });
    deepStrictEqual(JSON.parse(lResult.output), MINIMAL_RESULT);
  });

  it("returns a collapsed version of the report when passed a collapse option", async () => {
    const lResult = await format(cruiseResult, {
      collapse: "^[^/]+/[^/]+/",
    });
    const lCollapsedResult = lResult.output;

    deepStrictEqual(lCollapsedResult.summary.violations, [
      {
        type: "dependency",
        from: "src/cli/",
        to: "src/extract/",
        rule: {
          severity: "warn",
          name: "cli-to-main-only-warn",
        },
      },
    ]);
    strictEqual(lCollapsedResult.summary.totalCruised, 19);
    strictEqual(lCollapsedResult.summary.totalDependenciesCruised, 18);
  });

  it("returns string with error explanations when asked for the err-long report", async () => {
    const lErrorLongResult = await format(cruiseResult, {
      outputType: "err-long",
    });
    ok(lErrorLongResult.output.includes("cli-to-main-only-warn:"));
    ok(
      lErrorLongResult.output.includes(
        "This cli module depends on something not in the public interface"
      )
    );
  });

  it("returns string without error explanations when asked for the err report", async () => {
    const lErrorResult = await format(cruiseResult, {
      outputType: "err",
    });
    ok(lErrorResult.output.includes("cli-to-main-only-warn:"));
    ok(
      !lErrorResult.output.includes(
        "This cli module depends on something not in the public interface"
      )
    );
  });

  it("retains options that are in .summary.optionsUsed unless overwritten", async () => {
    const lResult = await format(cruiseResult, {
      outputType: "anon",
      includeOnly: "^src/",
    });
    const lJSONResult = JSON.parse(lResult.output);
    strictEqual(Object.keys(lJSONResult.summary.optionsUsed).length, 16);
    strictEqual(lJSONResult.summary.optionsUsed.outputType, "anon");
    strictEqual(lJSONResult.summary.optionsUsed.includeOnly, "^src/");
    // without includeOnly it'd be 53
    strictEqual(lJSONResult.modules.length, 33);
  });
});
