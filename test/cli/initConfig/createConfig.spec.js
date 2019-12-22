const fs = require("fs");
const path = require("path");
const chai = require("chai");
const stripJSONComments = require("strip-json-comments");
const createConfigFile = require("../../../src/cli/initConfig/createConfigFile");
const configurationSchema = require("../../../src/schema/configuration.schema.json");
const deleteDammit = require("../deleteDammit.utl");

const expect = chai.expect;
const RULES_FILE_JSON = ".dependency-cruiser.json";
const RULES_FILE_JS = ".dependency-cruiser.js";

chai.use(require("chai-json-schema"));

describe("cli/initConfig/createConfig", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("writes a valid config to .dependency-cruiser.json", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    try {
      createConfigFile({
        configFormat: ".json"
      });
      const lResult = JSON.parse(
        stripJSONComments(fs.readFileSync(RULES_FILE_JSON, "utf8"))
      );

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.not.haveOwnProperty("extends");
    } finally {
      deleteDammit(RULES_FILE_JSON);
    }
  });

  it("writes a valid config to .dependency-cruiser.json extending the passed preset", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    try {
      createConfigFile({
        configFormat: ".json",
        configType: "preset",
        preset: "@my/cool/company/configs/depcruise-preset"
      });
      const lResult = JSON.parse(
        stripJSONComments(fs.readFileSync(RULES_FILE_JSON, "utf8"))
      );

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("extends");
      expect(lResult.extends).to.equal(
        "@my/cool/company/configs/depcruise-preset"
      );
    } finally {
      deleteDammit(RULES_FILE_JSON);
    }
  });

  it("writes a valid config to .dependency-cruiser.json with a webpackConfig ", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    try {
      createConfigFile({
        configFormat: ".json",
        configType: "preset",
        preset: "@my/cool/company/configs/depcruise-preset",
        webpackConfig: "./webpack.conf.js"
      });
      const lResult = JSON.parse(
        stripJSONComments(fs.readFileSync(RULES_FILE_JSON, "utf8"))
      );

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("options");
      expect(lResult.options.webpackConfig).to.deep.equal({
        fileName: "./webpack.conf.js"
      });
    } finally {
      deleteDammit(RULES_FILE_JSON);
    }
  });

  it("writes a valid config to .dependency-cruiser.json with a tsConfig ", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    try {
      createConfigFile({
        configFormat: ".json",
        configType: "preset",
        preset: "@my/cool/company/configs/depcruise-preset",
        tsConfig: "./tsconfig.json"
      });
      const lResult = JSON.parse(
        stripJSONComments(fs.readFileSync(RULES_FILE_JSON, "utf8"))
      );

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("options");
      expect(lResult.options.tsConfig).to.deep.equal({
        fileName: "./tsconfig.json"
      });
    } finally {
      deleteDammit(RULES_FILE_JSON);
    }
  });

  it("writes a valid config to .dependency-cruiser.json; configType preset without preset yields warn-only", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    try {
      createConfigFile({
        configFormat: ".json",
        configType: "preset"
      });
      const lResult = JSON.parse(
        stripJSONComments(fs.readFileSync(RULES_FILE_JSON, "utf8"))
      );

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("extends");
      expect(lResult.extends).to.equal(
        "dependency-cruiser/configs/recommended-warn-only"
      );
    } finally {
      deleteDammit(RULES_FILE_JSON);
    }
  });

  it("writes a valid config to .dependency-cruiser.json - useYarnPnP", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JSON
    )}`;

    try {
      createConfigFile({
        configFormat: ".json",
        useYarnPnP: true
      });
      /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
      const lResult = JSON.parse(
        stripJSONComments(fs.readFileSync(RULES_FILE_JSON, "utf8"))
      );

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("options");
      expect(lResult.options.externalModuleResolutionStrategy).to.equal(
        "yarn-pnp"
      );
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JSON);
    }
  });

  it("writes a valid config to .dependency-cruiser.js", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      createConfigFile({
        configFormat: ".js"
      });
      /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.not.haveOwnProperty("extends");
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("writes a valid config to .dependency-cruiser.js extending the passed preset", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      createConfigFile({
        configFormat: ".js",
        configType: "preset",
        preset: "@my/cool/company/configs/depcruise-preset"
      });
      /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("forbidden");
      expect(lResult.extends).to.equal(
        "@my/cool/company/configs/depcruise-preset"
      );
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("writes a valid config to .dependency-cruiser.js - webpackConfig", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      createConfigFile({
        configFormat: ".js",
        webpackConfig: "./webpack.prod.js"
      });
      /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("options");
      expect(lResult.options.webpackConfig).to.deep.equal({
        fileName: "./webpack.prod.js"
      });
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("writes a valid config to .dependency-cruiser.js - tsConfig", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      createConfigFile({
        configFormat: ".js",
        tsConfig: "./tsconfig.json"
      });
      /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("options");
      expect(lResult.options.tsConfig).to.deep.equal({
        fileName: "./tsconfig.json"
      });
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("writes a valid config to .dependency-cruiser.js - useYarnPnP", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      createConfigFile({
        configFormat: ".js",
        useYarnPnP: true
      });
      /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("options");
      expect(lResult.options.externalModuleResolutionStrategy).to.equal(
        "yarn-pnp"
      );
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("does not overwrite an existing config", () => {
    process.chdir("test/cli/fixtures/init-config/config-file-exists");
    let lStillHere = true;

    fs.writeFileSync(RULES_FILE_JSON, "{}", { encoding: "utf8", flag: "w" });
    try {
      createConfigFile({ configFormat: ".json" });
    } catch (e) {
      lStillHere = false;
      expect(e.message).to.contain("already exists here - leaving it be");
    }

    expect(lStillHere).to.equal(false);

    expect(fs.readFileSync(RULES_FILE_JSON, "utf8")).to.equal("{}");
  });
});
