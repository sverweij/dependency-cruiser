/* eslint-disable node/global-require */
const path = require("path").posix;
const { expect } = require("chai");
const pathToPosix = require("../../../src/extract/utl/path-to-posix");
const { getExternalPluginReporter } = require("../../../src/report/plugins");

const FIXTURE_DIR = pathToPosix(path.join(__dirname, "fixtures"));

describe("report/plugins - getExternalPluginReporter", () => {
  it("throws when the plugin:reporter is not a valid plugin", () => {
    expect(() =>
      getExternalPluginReporter(
        `plugin:${path.join(FIXTURE_DIR, "invalid-no-exit-code-plugin")}`
      )
    ).to.throw(
      `${path.join(
        FIXTURE_DIR,
        "invalid-no-exit-code-plugin"
      )} is not a valid plugin`
    );
  });

  it("throws when the plugin:reporter does not exist", () => {
    expect(() =>
      getExternalPluginReporter(`plugin:this-plugin-does-not-exist`)
    ).to.throw("Could not find reporter plugin 'this-plugin-does-not-exist'");
  });

  it("returns false when it's not a plugin", () => {
    expect(getExternalPluginReporter(`whatever-just-not-a-plugin`)).to.equal(
      false
    );
    expect(getExternalPluginReporter()).to.equal(false);
  });

  it("returns the plugin module when it's valid and exists", () => {
    expect(
      getExternalPluginReporter(
        `plugin:${path.join(FIXTURE_DIR, "./valid-non-functional-plugin")}`
      )()
    ).to.deep.equal({
      output: "some string",
      exitCode: 42,
    });
  });
});
