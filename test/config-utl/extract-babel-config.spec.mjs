import { fileURLToPath } from "url";
import omit from "lodash/omit.js";
import { expect } from "chai";
import pathToPosix from "../../src/extract/utl/path-to-posix.js";
import extractBabelConfig from "../../src/config-utl/extract-babel-config.js";

function getFullPath(pRelativePath) {
  return fileURLToPath(new URL(pRelativePath, import.meta.url));
}

const DEFAULT_EMPTY_BABEL_OPTIONS_OBJECT = {
  babelrc: false,
  cloneInputAst: true,
  configFile: false,
  passPerPreset: false,
  envName: "development",
  cwd: process.cwd(),
  root: process.cwd(),
  rootMode: "root",
  plugins: [],
  presets: [],
  assumptions: {},
  browserslistConfigFile: false,
  targets: {},
};

describe("[I] config-utl/extract-babel-config", () => {
  it("throws when no config file name is passed", () => {
    expect(() => {
      extractBabelConfig();
    }).to.throw();
  });

  it("throws when a non-existing config file is passed", () => {
    expect(() => {
      extractBabelConfig("config-does-not-exist");
    }).to.throw();
  });

  it("throws when a config file is passed that does not contain valid json5", () => {
    expect(() => {
      extractBabelConfig(
        getFullPath("./__mocks__/babelconfig/babelrc.invalid.json")
      );
    }).to.throw();
  });

  it("throws when a config file is passed contains a non-babel option", () => {
    expect(() => {
      extractBabelConfig(
        getFullPath("./__mocks__/babelconfig/babelrc.not-a-babel-option.json")
      );
    }).to.throw();
  });

  it("returns a default options object when an empty config file is passed", () => {
    const lBabelConfig = extractBabelConfig(
      getFullPath("./__mocks__/babelconfig/babelrc.empty.json")
    );
    expect(lBabelConfig).to.have.property("filename");
    expect(pathToPosix(lBabelConfig.filename)).to.contain(
      "/__mocks__/babelconfig/babelrc.empty.json"
    );
    expect(omit(lBabelConfig, "filename")).to.deep.equal(
      DEFAULT_EMPTY_BABEL_OPTIONS_OBJECT
    );
  });

  it("reads the 'babel' key when a package.json is passed", () => {
    expect(
      extractBabelConfig(getFullPath("./__mocks__/babelconfig/package.json"))
        .plugins.length
    ).to.equal(1);
  });

  it("returns an empty (/ default) options object when package.json without a babel key is passed", () => {
    const lBabelConfig = extractBabelConfig(
      getFullPath(
        "./__mocks__/babelconfig/no-babel-config-in-this-package.json"
      )
    );
    expect(lBabelConfig).to.have.property("filename");
    expect(pathToPosix(lBabelConfig.filename)).to.contain(
      "/__mocks__/babelconfig/no-babel-config-in-this-package.json"
    );
    expect(omit(lBabelConfig, "filename")).to.deep.equal(
      DEFAULT_EMPTY_BABEL_OPTIONS_OBJECT
    );
  });

  it("returns a babel config when a javascript file with a regular object export is passed", () => {
    expect(
      extractBabelConfig(
        getFullPath("./__mocks__/babelconfig-js/babel.object-export.config.js")
      ).plugins.length
    ).to.equal(1);
  });

  it("returns a babel config _including_ the array of plugins when a config with presets is passed", () => {
    const lFoundConfig = extractBabelConfig(
      getFullPath("./__mocks__/babelconfig/babelrc.with-a-preset.json")
    );
    expect(lFoundConfig.presets.length).to.equal(1);
    expect(lFoundConfig.presets).to.deep.equal(["@babel/preset-typescript"]);
  });

  it("throws when a javascript file with a function export is passed", () => {
    expect(() => {
      extractBabelConfig(
        getFullPath(
          "./__mocks__/babelconfig-js/babel.function-export.config.js"
        )
      );
    }).to.throw();
  });

  it("throws when a config with an unsupported extension is passed", () => {
    expect(() => {
      extractBabelConfig(
        getFullPath(
          "./__mocks__/babelconfig-js/babel.config.wildly-unsupported-extension"
        )
      );
    }).to.throw();
  });

  it("throws when an es module is passed", () => {
    expect(() => {
      extractBabelConfig(
        getFullPath("./__mocks__/babelconfig-js/babel.es-module.config.js")
      );
    }).to.throw();
  });
});
