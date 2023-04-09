import { fileURLToPath } from "node:url";
import omit from "lodash/omit.js";
import { expect } from "chai";
import pathToPosix from "../../src/utl/path-to-posix.mjs";
import extractBabelConfig from "../../src/config-utl/extract-babel-config.mjs";

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
  it("throws when no config file name is passed", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig();
    } catch (pError) {
      lThrown = true;
    }
    expect(lThrown).to.equal(true);
  });

  it("throws when a non-existing config file is passed", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig("config-does-not-exist");
    } catch (pError) {
      lThrown = true;
    }
    expect(lThrown).to.equal(true);
  });

  it("throws when a config file is passed that does not contain valid json5", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig(
        getFullPath("./__mocks__/babelconfig/babelrc.invalid.json")
      );
    } catch (pError) {
      lThrown = true;
    }
    expect(lThrown).to.equal(true);
  });

  it("throws when a config file is passed contains a non-babel option", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig(
        getFullPath("./__mocks__/babelconfig/babelrc.not-a-babel-option.json")
      );
    } catch (pError) {
      lThrown = true;
    }
    expect(lThrown).to.equal(true);
  });

  it("returns a default options object when an empty config file is passed", async () => {
    const lBabelConfig = await extractBabelConfig(
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

  it("reads the 'babel' key when a package.json is passed", async () => {
    const lBabelKey = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig/package.json")
    );
    expect(lBabelKey.plugins.length).to.equal(1);
  });

  it("returns an empty (/ default) options object when package.json without a babel key is passed", async () => {
    const lBabelConfig = await extractBabelConfig(
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

  it("returns a babel config when a javascript file with a regular object export is passed", async () => {
    const lModule = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig-js/babel.object-export.config.js")
    );
    expect(lModule.plugins.length).to.equal(1);
  });

  it("returns a babel config _including_ the array of plugins when a config with presets is passed", async () => {
    const lFoundConfig = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig/babelrc.with-a-preset.json")
    );
    expect(lFoundConfig.presets.length).to.equal(1);
    expect(lFoundConfig.presets).to.deep.equal(["@babel/preset-typescript"]);
  });

  it("throws when a javascript file with a function export is passed", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig(
        getFullPath(
          "./__mocks__/babelconfig-js/babel.function-export.config.js"
        )
      );
    } catch (pError) {
      lThrown = true;
    }
    expect(lThrown).to.equal(true);
  });

  it("throws when a config with an unsupported extension is passed", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig(
        getFullPath(
          "./__mocks__/babelconfig-js/babel.config.wildly-unsupported-extension"
        )
      );
    } catch (pError) {
      lThrown = true;
    }
    expect(lThrown).to.equal(true);
  });

  it("returns a babel config even when an es module is passed (.js extension)", async () => {
    const lFoundConfig = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig-js/babel.es-module.config.mjs")
    );
    expect(lFoundConfig.plugins.length).to.equal(1);
    expect(lFoundConfig.plugins[0].key).to.deep.equal(
      "transform-modules-commonjs"
    );
  });
  it("returns a babel config even when an es module is passed (.mjs extension)", async () => {
    const lFoundConfig = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig-js/babel.es-module.config.mjs")
    );
    expect(lFoundConfig.plugins.length).to.equal(1);
    expect(lFoundConfig.plugins[0].key).to.deep.equal(
      "transform-modules-commonjs"
    );
  });
});
