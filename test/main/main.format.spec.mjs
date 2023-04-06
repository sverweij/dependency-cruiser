/* eslint-disable no-magic-numbers */
import { expect } from "chai";
import { format } from "../../src/main/index.mjs";
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
  it("barfs when it gets an invalid output type", () => {
    expect(() => {
      format({}, { outputType: "not-a-valid-reporter" });
    }).to.throw("'not-a-valid-reporter' is not a valid output type.");
  });

  it("barfs when it gets a result passed that is invalid json", () => {
    expect(() => {
      format("that is no json");
    }).to.throw("The supplied dependency-cruiser result is not valid:");
  });

  it("barfs when it gets a result passed that doesn't comply to the result schema", () => {
    expect(() => {
      format({ valid: "JSON", not: "schema compliant though" });
    }).to.throw(
      "The supplied dependency-cruiser result is not valid: data must have required property 'summary'"
    );
  });

  it("returns an error reporter formatted report when presented with a legal result", () => {
    expect(format(MINIMAL_RESULT, { outputType: "err" }).output).to.contain(
      "no dependency violations found (0 modules, 0 dependencies cruised)"
    );
  });

  it("returns an json reporter formatted report when presented with a legal result", () => {
    expect(
      JSON.parse(format(MINIMAL_RESULT, { outputType: "json" }).output)
    ).to.deep.equal(MINIMAL_RESULT);
  });

  it("returns a collapsed version of the report when passed a collapse option", () => {
    const lCollapsedResult = format(cruiseResult, {
      collapse: "^[^/]+/[^/]+/",
    }).output;

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

  it("returns string with error explanations when asked for the err-long report", () => {
    const lErrorLongResult = format(cruiseResult, {
      outputType: "err-long",
    }).output;
    expect(lErrorLongResult).to.contain("cli-to-main-only-warn:");
    expect(lErrorLongResult).to.contain(
      "This cli module depends on something not in the public interface"
    );
  });

  it("returns string without error explanations when asked for the err report", () => {
    const lErrorResult = format(cruiseResult, {
      outputType: "err",
    }).output;
    expect(lErrorResult).to.contain("cli-to-main-only-warn:");
    expect(lErrorResult).to.not.contain(
      "This cli module depends on something not in the public interface"
    );
  });

  it("retains options that are in .summary.optionsUsed unless overriden", () => {
    const lJSONResult = JSON.parse(
      format(cruiseResult, {
        outputType: "anon",
        includeOnly: "^src/",
      }).output
    );
    expect(Object.keys(lJSONResult.summary.optionsUsed).length).to.equal(16);
    expect(lJSONResult.summary.optionsUsed.outputType).to.equal("anon");
    expect(lJSONResult.summary.optionsUsed.includeOnly).to.equal("^src/");
    // without includeOnly it'd be 53
    expect(lJSONResult.modules.length).to.equal(33);
  });
});
