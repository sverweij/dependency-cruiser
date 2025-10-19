import { deepEqual, ok, equal } from "node:assert/strict";
import { fileURLToPath } from "node:url";
import extractBabelConfig from "#config-utl/extract-babel-config.mjs";
import pathToPosix from "#utl/path-to-posix.mjs";

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
    equal(lThrown, true);
  });

  it("throws when a non-existing config file is passed", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig("config-does-not-exist");
    } catch (pError) {
      lThrown = true;
    }
    equal(lThrown, true);
  });

  it("throws when a config file is passed that does not contain valid json5", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig(
        getFullPath("./__mocks__/babelconfig/babelrc.invalid.json"),
      );
    } catch (pError) {
      lThrown = true;
    }
    equal(lThrown, true);
  });

  it("throws when a config file is passed contains a non-babel option", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig(
        getFullPath("./__mocks__/babelconfig/babelrc.not-a-babel-option.json"),
      );
    } catch (pError) {
      lThrown = true;
    }
    equal(lThrown, true);
  });

  it("returns a default options object when an empty config file is passed", async () => {
    const lBabelConfig = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig/babelrc.empty.json"),
    );
    ok(lBabelConfig.hasOwnProperty("filename"));
    ok(
      pathToPosix(lBabelConfig.filename).includes(
        "/__mocks__/babelconfig/babelrc.empty.json",
      ),
    );
    const lBabelConfigWithoutFilename = structuredClone(lBabelConfig);
    delete lBabelConfigWithoutFilename.filename;
    deepEqual(lBabelConfigWithoutFilename, DEFAULT_EMPTY_BABEL_OPTIONS_OBJECT);
  });

  it("reads the 'babel' key when a package.json is passed", async () => {
    const lBabelKey = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig/package.json"),
    );
    equal(lBabelKey.plugins.length, 1);
  });

  it("returns an empty (/ default) options object when package.json without a babel key is passed", async () => {
    const lBabelConfig = await extractBabelConfig(
      getFullPath(
        "./__mocks__/babelconfig/no-babel-config-in-this-package.json",
      ),
    );
    ok(lBabelConfig.hasOwnProperty("filename"));
    ok(
      pathToPosix(lBabelConfig.filename).includes(
        "/__mocks__/babelconfig/no-babel-config-in-this-package.json",
      ),
    );
    const lBabelConfigWithoutFilename = structuredClone(lBabelConfig);
    delete lBabelConfigWithoutFilename.filename;
    deepEqual(lBabelConfigWithoutFilename, DEFAULT_EMPTY_BABEL_OPTIONS_OBJECT);
  });

  it("returns a babel config when a javascript file with a regular object export is passed", async () => {
    const lModule = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig-js/babel.object-export.config.js"),
    );
    equal(lModule.plugins.length, 1);
  });

  it("throws when a javascript file with a syntax error is passed", async () => {
    let lThrown = false;
    let lErrorMessage = "";
    try {
      await extractBabelConfig(
        getFullPath("./__mocks__/babelconfig-js/babel.syntax-error.config.js"),
      );
    } catch (pError) {
      lThrown = true;
      lErrorMessage = pError.message;
    }
    equal(lThrown, true);
    ok(
      lErrorMessage.includes("Encountered an error while parsing babel config"),
    );
    ok(lErrorMessage.includes("babel.syntax-error.config.js"));
  });

  it("returns a babel config _including_ the array of plugins when a config with presets is passed", async () => {
    const lFoundConfig = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig/babelrc.with-a-preset.json"),
    );
    equal(lFoundConfig.presets.length, 1);
    deepEqual(lFoundConfig.presets, ["@babel/preset-typescript"]);
  });

  it("throws when a javascript file with a function export is passed", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig(
        getFullPath(
          "./__mocks__/babelconfig-js/babel.function-export.config.js",
        ),
      );
    } catch (pError) {
      lThrown = true;
    }
    equal(lThrown, true);
  });

  it("throws when a config with an unsupported extension is passed", async () => {
    let lThrown = false;
    try {
      await extractBabelConfig(
        getFullPath(
          "./__mocks__/babelconfig-js/babel.config.wildly-unsupported-extension",
        ),
      );
    } catch (pError) {
      lThrown = true;
    }
    equal(lThrown, true);
  });

  it("returns a babel config even when an es module is passed (.js extension)", async () => {
    const lFoundConfig = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig-js/babel.es-module.config.mjs"),
    );
    equal(lFoundConfig.plugins.length, 1);
    deepEqual(lFoundConfig.plugins[0].key, "transform-modules-commonjs");
  });
  it("returns a babel config even when an es module is passed (.mjs extension)", async () => {
    const lFoundConfig = await extractBabelConfig(
      getFullPath("./__mocks__/babelconfig-js/babel.es-module.config.mjs"),
    );
    equal(lFoundConfig.plugins.length, 1);
    deepEqual(lFoundConfig.plugins[0].key, "transform-modules-commonjs");
  });
});
