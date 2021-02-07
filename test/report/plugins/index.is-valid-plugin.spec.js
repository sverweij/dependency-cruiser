/* eslint-disable node/global-require */
const { expect } = require("chai");
const { isValidPlugin } = require("../../../src/report/plugins");

describe("report/plugins - isValidPlugin", () => {
  it("returns false when the plugin's function doesn't return an exit code attribute", () => {
    expect(
      isValidPlugin(require("./fixtures/invalid-no-exit-code-plugin"))
    ).to.equal(false);
  });

  it("returns false when the plugin's function doesn't return an output attribute", () => {
    expect(
      isValidPlugin(require("./fixtures/invalid-no-output-plugin"))
    ).to.equal(false);
  });

  it("returns false when the plugin's function doesn't return an exit code that is not a number", () => {
    expect(
      isValidPlugin(require("./fixtures/invalid-non-number-exit-code-plugin"))
    ).to.equal(false);
  });

  it("returns false when the plugin doesn't return a function", () => {
    expect(
      isValidPlugin(require("./fixtures/invalid-not-a-function-plugin"))
    ).to.equal(false);
  });

  it("returns true when the plugin doesn't returns a function that takes a minimal cruise result and returns an output attribute + an numberical exitCode attribute", () => {
    expect(isValidPlugin(require("./fixtures/valid-plugin"))).to.equal(true);
  });
});
