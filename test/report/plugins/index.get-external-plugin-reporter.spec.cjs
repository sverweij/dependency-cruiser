const path = require("path");
const { expect } = require("chai");
const { getExternalPluginReporter } = require("../../../src/report/plugins");

const FIXTURE_DIRECTORY = path.join(__dirname, "__fixtures__");

describe("[I] report/plugins - getExternalPluginReporter", () => {
  it("throws when the plugin:reporter is not a valid plugin (missing exit code)", () => {
    const lNoExitCodePlugin = path.join(
      FIXTURE_DIRECTORY,
      "invalid-no-exit-code-plugin.cjs"
    );
    expect(() =>
      getExternalPluginReporter(`plugin:${lNoExitCodePlugin}`)
    ).to.throw(`${lNoExitCodePlugin} is not a valid plugin`);
  });

  it("throws when the plugin:reporter is not a valid plugin (missing output)", () => {
    const lNoExitCodePlugin = path.join(
      FIXTURE_DIRECTORY,
      "invalid-no-output-plugin.cjs"
    );
    expect(() =>
      getExternalPluginReporter(`plugin:${lNoExitCodePlugin}`)
    ).to.throw(`${lNoExitCodePlugin} is not a valid plugin`);
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

  it("throws when the plugin:reporter is not a valid plugin (package ref)", () => {
    expect(() =>
      getExternalPluginReporter(`plugin:dependency-cruiser`)
    ).to.throw(`dependency-cruiser is not a valid plugin`);
  });

  it("returns the plugin module when it's valid and exists", () => {
    const lSampleReporter = getExternalPluginReporter(
      "plugin:dependency-cruiser/sample-reporter-plugin"
    );
    const lResults = lSampleReporter({
      modules: [],
      summary: { totalCruised: 0 },
    });
    expect(lResults).to.haveOwnProperty("output");
    expect(lResults).to.haveOwnProperty("exitCode");
    expect(lResults.exitCode).to.equal(0);
  });
});
