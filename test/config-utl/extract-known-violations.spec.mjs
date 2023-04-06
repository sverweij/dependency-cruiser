import { expect } from "chai";
import extractKnownViolations from "../../src/config-utl/extract-known-violations.mjs";

describe("[I] config-utl/extractKnownViolations", () => {
  const WORKINGDIR = process.cwd();

  afterEach(() => {
    process.chdir(WORKINGDIR);
  });

  it("Throws when passed a non-existing file", () => {
    expect(() =>
      extractKnownViolations("this_file_really_does_not_exist")
    ).to.throw();
  });

  it("Throws a SyntaxError when passed non-json", () => {
    process.chdir("./test/config-utl/__mocks__/known-violations");
    expect(() => extractKnownViolations("this-is-no-json.txt")).to.throw(
      SyntaxError
    );
  });

  it("Return the parsed json content of the violations file", () => {
    process.chdir("./test/config-utl/__mocks__/known-violations");
    expect(extractKnownViolations("known-violations.json")).to.deep.equal([
      {
        from: "src/schema/baseline-violations.schema.js",
        to: "src/schema/baseline-violations.schema.js",
        rule: {
          severity: "error",
          name: "not-unreachable-from-cli",
        },
      },
      {
        from: "src/cli/format.js",
        to: "src/cli/format.js",
        rule: {
          severity: "info",
          name: "not-reachable-from-folder-index",
        },
      },
    ]);
  });
});
