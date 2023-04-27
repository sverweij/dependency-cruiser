import { expect } from "chai";
import extractKnownViolations from "../../src/config-utl/extract-known-violations.mjs";

describe("[I] config-utl/extractKnownViolations", () => {
  const WORKINGDIR = process.cwd();

  afterEach(() => {
    process.chdir(WORKINGDIR);
  });

  it("Throws when passed a non-existing file", async () => {
    let lError = "none";

    try {
      await extractKnownViolations("this_file_really_does_not_exist");
    } catch (pError) {
      lError = pError.toString();
    }
    expect(lError).to.contain(`ENOENT: no such file or directory, open`);
    expect(lError).to.contain("this_file_really_does_not_exist");
  });

  it("Throws a SyntaxError when passed non-json", async () => {
    process.chdir("./test/config-utl/__mocks__/known-violations");

    let lError = "none";

    try {
      await extractKnownViolations("this-is-no-json.txt");
    } catch (pError) {
      lError = pError;
    }

    expect(lError).to.be.instanceOf(SyntaxError);
  });

  it("Return the parsed json content of the violations file", async () => {
    process.chdir("./test/config-utl/__mocks__/known-violations");
    expect(await extractKnownViolations("known-violations.json")).to.deep.equal(
      [
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
      ]
    );
  });
});
