const path = require("path");
const chai = require("chai");
const initConfig = require("../../../src/cli/initConfig");
const configurationSchema = require("../../../src/schema/configuration.schema.json");
const deleteDammit = require("../deleteDammit.utl");

const expect = chai.expect;

const RULES_FILE_JS = ".dependency-cruiser.js";

describe("cli/initConfig/index", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("init called with a string !== 'preset' creates a self-contained js rules file", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      initConfig("notyes");
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

  it("init preset creates a preset based js rules file", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      initConfig("preset");
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.haveOwnProperty("extends");
      expect(lResult.extends).to.equal(
        "dependency-cruiser/configs/recommended-strict"
      );
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init yes creates a self-contained js rules file", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      initConfig("yes");
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
});
/* muffle eslint for we're doing the funky require shizzle consciously here */
/* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
