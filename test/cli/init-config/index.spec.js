const fs = require("fs");
const path = require("path");
const chai = require("chai");
const deleteDammit = require("../delete-dammit.utl");
const initConfig = require("../../../src/cli/init-config");
const configurationSchema = require("../../../src/schema/configuration.schema.json");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

const RULES_FILE_JS = ".dependency-cruiser.js";

describe("cli/init-config/index", () => {
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
      expect(lResult.options).to.not.haveOwnProperty("tsConfig");
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init yes in a ts project creates a self-contained js rules file with typescript things flipped to yes", () => {
    process.chdir("test/cli/fixtures/init-config/ts-config-exists");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/ts-config-exists",
      RULES_FILE_JS
    )}`;

    try {
      initConfig("yes");
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.not.haveOwnProperty("extends");
      expect(lResult.options).to.haveOwnProperty("tsConfig");
      expect(lResult.options.tsConfig).to.deep.equal({
        fileName: "tsconfig.json",
      });
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init yes in a webpack project creates a self-contained js rules file with webpack things flipped to yes", () => {
    process.chdir("test/cli/fixtures/init-config/webpack-config-exists");
    const configResultFileName = `./${path.join(
      "../fixtures/init-config/webpack-config-exists",
      RULES_FILE_JS
    )}`;

    try {
      initConfig("yes");
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.not.haveOwnProperty("extends");
      expect(lResult.options).to.haveOwnProperty("webpackConfig");
      expect(lResult.options.webpackConfig).to.deep.equal({
        fileName: "webpack.config.js",
      });
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init experimental-scripts creates a .dependency-cruiser config + updates package.json with scripts", () => {
    process.chdir("test/cli/init-config/fixtures/update-manifest");

    const configResultFileName = `./${path.join(
      "fixtures/update-manifest",
      RULES_FILE_JS
    )}`;

    const lManifestFilename = "package.json";
    fs.writeFileSync(lManifestFilename, "{}");

    try {
      initConfig("experimental-scripts");
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(
        JSON.parse(fs.readFileSync(lManifestFilename, "utf8"))
      ).to.haveOwnProperty("scripts");
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(RULES_FILE_JS);
      deleteDammit(lManifestFilename);
    }
  });

  it("init experimental-scripts updates package.json with scripts, and leaves an existing dc config alone", () => {
    process.chdir(
      "test/cli/init-config/fixtures/update-manifest-dc-config-exists"
    );

    const configResultFileName = `./${path.join(
      "fixtures/update-manifest-dc-config-exists",
      RULES_FILE_JS
    )}`;
    const lManifestFilename = "package.json";
    fs.writeFileSync(lManifestFilename, "{}");

    try {
      initConfig("experimental-scripts");
      const lResult = require(configResultFileName);

      expect(lResult).to.be.jsonSchema(configurationSchema);
      expect(lResult).to.deep.equal({});
      expect(
        JSON.parse(fs.readFileSync(lManifestFilename, "utf8"))
      ).to.haveOwnProperty("scripts");
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(configResultFileName)
      );
      deleteDammit(lManifestFilename);
    }
  });
});
/* muffle eslint for we're doing the funky require shizzle consciously here */
/* eslint node/global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
