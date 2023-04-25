/* eslint-disable no-magic-numbers */
import { expect } from "chai";
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
    expect(lErrorMessage).to.contain(
      "'not-a-valid-reporter' is not a valid output type."
    );
  });

  it("barfs when it gets a result passed that is invalid json", async () => {
    let lErrorMessage = "none";
    try {
      await format("that is no json");
    } catch (pError) {
      lErrorMessage = pError.message;
    }
    expect(lErrorMessage).to.contain(
      "The supplied dependency-cruiser result is not valid:"
    );
  });

  it("barfs when it gets a result passed that doesn't comply to the result schema", async () => {
    let lErrorMessage = "none";
    try {
      await format({ valid: "JSON", not: "schema compliant though" });
    } catch (pError) {
      lErrorMessage = pError.message;
    }
    expect(lErrorMessage).to.contain(
      "The supplied dependency-cruiser result is not valid: data must have required property 'summary'"
    );
  });

  it("returns an error reporter formatted report when presented with a legal result", async () => {
    const lResult = await format(MINIMAL_RESULT, { outputType: "err" });
    expect(lResult.output).to.contain(
      "no dependency violations found (0 modules, 0 dependencies cruised)"
    );
  });

  it("returns an json reporter formatted report when presented with a legal result", async () => {
    const lResult = await format(MINIMAL_RESULT, { outputType: "json" });
    expect(JSON.parse(lResult.output)).to.deep.equal(MINIMAL_RESULT);
  });

  it("returns a collapsed version of the report when passed a collapse option", async () => {
    const lResult = await format(cruiseResult, {
      collapse: "^[^/]+/[^/]+/",
    });
    const lCollapsedResult = lResult.output;

    expect(lCollapsedResult.summary.violations).to.deep.equal([
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
    expect(lCollapsedResult.summary.totalCruised).to.equal(19);
    expect(lCollapsedResult.summary.totalDependenciesCruised).to.equal(18);
  });

  it("returns string with error explanations when asked for the err-long report", async () => {
    const lErrorLongResult = await format(cruiseResult, {
      outputType: "err-long",
    });
    expect(lErrorLongResult.output).to.contain("cli-to-main-only-warn:");
    expect(lErrorLongResult.output).to.contain(
      "This cli module depends on something not in the public interface"
    );
  });

  it("returns string without error explanations when asked for the err report", async () => {
    const lErrorResult = await format(cruiseResult, {
      outputType: "err",
    });
    expect(lErrorResult.output).to.contain("cli-to-main-only-warn:");
    expect(lErrorResult.output).to.not.contain(
      "This cli module depends on something not in the public interface"
    );
  });

  it("retains options that are in .summary.optionsUsed unless overwritten", async () => {
    const lResult = await format(cruiseResult, {
      outputType: "anon",
      includeOnly: "^src/",
    });
    const lJSONResult = JSON.parse(lResult.output);
    expect(Object.keys(lJSONResult.summary.optionsUsed).length).to.equal(16);
    expect(lJSONResult.summary.optionsUsed.outputType).to.equal("anon");
    expect(lJSONResult.summary.optionsUsed.includeOnly).to.equal("^src/");
    // without includeOnly it'd be 53
    expect(lJSONResult.modules.length).to.equal(33);
  });
});
