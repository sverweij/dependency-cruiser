const fs = require("fs");
const path = require("path");
const chai = require("chai");
const createConfigFile = require("../../../src/cli/init-config/create-config-file");
const configurationSchema = require("../../../src/schema/configuration.schema.json");
const deleteDammit = require("../delete-dammit.utl");

const expect = chai.expect;
const RULES_FILE_JS = ".dependency-cruiser.js";

chai.use(require("chai-json-schema"));

describe("cli/init-config/createConfig", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("writes a valid config to .dependency-cruiser.json; configType preset without preset yields warn-only", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      createConfigFile({
        configType: "preset"
      });
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("extends");
      expect(lResult.extends).to.equal(
        "dependency-cruiser/configs/recommended-warn-only"
      );
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("writes a valid config to .dependency-cruiser.js with all things in one", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      createConfigFile({});

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
        useWebpackConfig: true,
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
        useTsConfig: true,
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

    fs.writeFileSync(RULES_FILE_JS, "module.exports = {}", {
      encoding: "utf8",
      flag: "w"
    });
    try {
      createConfigFile();
    } catch (pError) {
      lStillHere = false;
      expect(pError.message).to.contain("already exists here - leaving it be");
    }

    expect(lStillHere).to.equal(false);

    expect(fs.readFileSync(RULES_FILE_JS, "utf8")).to.equal(
      "module.exports = {}"
    );
  });
});

/* yep - doing some interesting things with requires here. Muffle eslint for this: */
/* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
