const path = require("path").posix;
const expect = require("chai").expect;
const parseBabelConfig = require("../../src/cli/parse-babel-config");

const DEFAULT_EMPTY_BABEL_OPTIONS_OBJECT = {
  babelrc: false,
  configFile: false,
  passPerPreset: false,
  envName: "development",
  cwd: process.cwd(),
  root: process.cwd(),
  plugins: [],
  presets: [],
};

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

  it("throws when a config file is passed contains a non-babel option", () => {
    expect(() => {
      parseBabelConfig(
        path.join(
          __dirname,
          "./fixtures/babelconfig/babelrc.not-a-babel-option.json"
        )
      );
    }).to.throw();
  });

  it("returns a default options object when an empty config file is passed", () => {
    expect(
      parseBabelConfig(
        path.join(__dirname, "./fixtures/babelconfig/babelrc.empty.json")
      )
    ).to.deep.equal(DEFAULT_EMPTY_BABEL_OPTIONS_OBJECT);
  });

  it("reads the 'babel' key when a package.json is passed", () => {
    expect(
      parseBabelConfig(
        path.join(__dirname, "./fixtures/babelconfig/package.json")
      ).plugins.length
    ).to.equal(1);
  });

  it("returns an empty (/ default) options object when package.json without a babel key is passed", () => {
    expect(
      parseBabelConfig(
        path.join(
          __dirname,
          "./fixtures/babelconfig/no-babel-config-in-this-package.json"
        )
      )
    ).to.deep.equal(DEFAULT_EMPTY_BABEL_OPTIONS_OBJECT);
  });

  it("returns a babel config when a javascript file with a regular object export is passed", () => {
    expect(
      parseBabelConfig(
        path.join(
          __dirname,
          "./fixtures/babelconfig-js/babel.object-export.config.js"
        )
      ).plugins.length
    ).to.equal(1);
  });

  it("throws when a javascript file with a function export is passed", () => {
    expect(() => {
      parseBabelConfig(
        path.join(
          __dirname,
          "./fixtures/babelconfig-js/babel.function-export.config.js"
        )
      );
    }).to.throw();
  });

  it("throws when a config with an unsupported extension is passed", () => {
    expect(() => {
      parseBabelConfig(
        path.join(
          __dirname,
          "./fixtures/babelconfig-js/babel.config.wildly-unsupported-extension"
        )
      );
    }).to.throw();
  });

  it("throws when an es module is passed", () => {
    expect(() => {
      parseBabelConfig(
        path.join(
          __dirname,
          "./fixtures/babelconfig-js/babel.es-module.config.js"
        )
      );
    }).to.throw();
  });
});
