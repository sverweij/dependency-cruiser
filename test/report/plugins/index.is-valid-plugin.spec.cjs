/* eslint-disable node/global-require */
const { expect } = require("chai");
const { isValidPlugin } = require("../../../src/report/plugins.js");

describe("[U] report/plugins - isValidPlugin", () => {
  it("returns false when the plugin's function doesn't return an exit code attribute", () => {
    expect(
      isValidPlugin(require("./__fixtures__/invalid-no-exit-code-plugin.cjs"))
    ).to.equal(false);
  });

  it("returns false when the plugin's function doesn't return an output attribute", () => {
    expect(
      isValidPlugin(require("./__fixtures__/invalid-no-output-plugin.cjs"))
    ).to.equal(false);
  });

  it("returns false when the plugin's function doesn't return an exit code that is not a number", () => {
    expect(
      isValidPlugin(
        require("./__fixtures__/invalid-non-number-exit-code-plugin.cjs")
      )
    ).to.equal(false);
  });

  it("returns false when the plugin doesn't return a function", () => {
    expect(
      isValidPlugin(require("./__fixtures__/invalid-not-a-function-plugin.cjs"))
    ).to.equal(false);
  });

  it("returns true when the plugin doesn't returns a function that takes a minimal cruise result and returns an output attribute + an numerical exitCode attribute", () => {
    expect(isValidPlugin(require("./__fixtures__/valid-plugin.cjs"))).to.equal(
      true
    );
  });
});
