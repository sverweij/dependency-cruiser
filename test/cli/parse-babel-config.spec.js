const path = require("path").posix;
const expect = require("chai").expect;
const parseBabelConfig = require("../../src/cli/parse-babel-config");

describe("cli/parseBabelConfig", () => {
  it("throws when no config file name is passed", () => {
    expect(() => {
      parseBabelConfig();
    }).to.throw();
  });

  it("throws when a non-existing config file is passed", () => {
    expect(() => {
      parseBabelConfig("config-does-not-exist");
    }).to.throw();
  });

  it("throws when a config file is passed that does not contain valid json5", () => {
    expect(() => {
      parseBabelConfig(
        path.join(__dirname, "./fixtures/babelconfig/babelrc.invalid.json")
      );
    }).to.throw();
  });

  it("throws when a config file is passed constains a non-babel option", () => {
    expect(() => {
      parseBabelConfig(
        path.join(
          __dirname,
          "./fixtures/babelconfig/babelrc.not-a-babel-option.json"
        )
      );
    }).to.throw();
  });

  it("returns an default options object when an empty config file is passed", () => {
    expect(
      parseBabelConfig(
        path.join(__dirname, "./fixtures/babelconfig/babelrc.empty.json")
      )
    ).to.deep.equal({
      babelrc: false,
      configFile: false,
      passPerPreset: false,
      envName: "development",
      cwd: process.cwd(),
      root: process.cwd(),
      plugins: [],
      presets: [],
    });
  });
});
